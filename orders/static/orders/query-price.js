// Create object with values to be submitted
// Send default values to quote for a price
// If select box changes, update object
// Requote for price


const Cart = {
    // Use the array of manipulating data and send to local storage afterwards
    // Cart items are stored as objects in this array
    orders: [],
    init() {
        // Gets cart data from localstorage
        this.getOrder();

        // Data object to be sent to server
        const data = {};

        // Category and product are hidden in html and are used for simplyfying the queries to server
        // Those are used in the Ajax calls
        const category = document.getElementById('category').textContent;
        const product = document.getElementById('product').textContent;

        // Remove ' or " from product and category that are in hidden in the page
        data['category'] = category.replace(/['"]+/g, '');
        data['product'] = product.replace(/['"]+/g, '');

        // If toppings checkbox is checked, add to price and to data field, if unchecked, subtract from price and remove from Data
        if (data['category'] === 'Sub') {
            this.checkSubToppings();
            // As this specific sub has no small size, I removed the small option from select box
            if (data['product'] === 'Sausage, Peppers and Onions') {
                let options = document.querySelector('#id_size').options;
                // Selects Large option
                options[1].selected = true;
                // Deselects Small option
                options[0].selected = false;
                // Disables Small option
                options[0].disabled = true;
            }
        }

        // Sets default select values into object and query initial price
        document.querySelectorAll('select').forEach(item => {
            data[item.name] = item.value;
        });

        // Query for initial item price
        this.requestAjax(data)

        // If it's a Pizza, change number of toppings message
        if (data['category'] === 'Pizza') {
            this.displayPizzaToppingMessage();
        }

        // Set event listener for send order button clicks
        this.sendOrder(data['category'])

        // If select box changes, update object and query again for price
        document.querySelectorAll('select').forEach(item => {
            item.onchange = () => {
                // If it's a Pizza, change number of toppings message
                if (data['category'] === 'Pizza') {
                    this.displayPizzaToppingMessage();
                }
                data[item.name] = item.value;
                this.requestAjax(data);
            };
        });
    },
    sendOrder(category) {
        let submitButton = document.querySelector('#order-button');
        // Add slug and quantity to localStorage when submit button is clicked
        submitButton.addEventListener('click', event => {
            console.log('Adding event listener')
            // Prevents page from reloading
            event.preventDefault();

            // Retrieve data from buttom element, who stored data from last Ajax call
            const slug = submitButton.dataset.slug;
            const name = submitButton.dataset.name;
            const price = submitButton.dataset.price;
            // If product is Pizza
            if (category === 'Pizza') {
                // Check if number of toppings corresponds to number of allowed toppings
                if (Cart.checkPizzaToppings()) {
                    Cart.setStorage(slug, price, name);
                    Cart.displayAlert('Pizza added to cart')
                } else {
                    Cart.displayAlert('Please check the number of toppings to continue')
                }
            } else {
                // For other product categories
                Cart.setStorage(slug, price, name);
                Cart.displayAlert('Product added to cart')
            }
        });
    },
    // Gets data from local storage, converts to Json and stores in orders. If no localStorage, display message
    getOrder() {
        let contents = localStorage.getItem('orders');
        if (contents) {
            Cart.orders = JSON.parse(contents);
        } else {
            console.log('No orders');
        }
    },
    saveOrder() {
        let localCart = Cart.orders;
        localStorage.setItem('orders', JSON.stringify(localCart))
    },
    // Sends data to server using Ajax
    requestAjax(data) {
        var csrftoken = Cart.getCookie('csrftoken');

        // Initiate new request
        const request = new XMLHttpRequest();
        request.open('POST', '/products/check-price/', true);

        // Set request header with CSRF token code
        request.setRequestHeader('X-CSRFToken', csrftoken);
        request.setRequestHeader('contentType', 'application/json; charset=utf-8');

        // Callback function for when request completes
        request.onload = () => {
            const serverResponse = JSON.parse(request.responseText);

            if (serverResponse.success) {
                const submitButton = document.querySelector('#order-button');
                console.log(`Server returned: ${serverResponse.image}`);
                // Adds price to submit button
                content = `${serverResponse.price}`;
                document.querySelector('#price').innerHTML = content;

                // Store data in button element for later use
                submitButton.setAttribute('data-name', serverResponse.name);
                submitButton.setAttribute('data-slug', serverResponse.slug);
                submitButton.setAttribute('data-price', serverResponse.price);

                // Sets product image
                this.setProductImage(serverResponse.image);

                // Add action url to form
                document.querySelector('#order-form').action = '#';

                if (data['category'] === 'Sub') {
                    // Rechecks if toppings are selected, updates price
                    this.priceToppings();
                }

                // Enables form to send data again, if blocked before
                document.querySelector('#order-form').onsubmit = e => {
                    e.returnValue = true;
                };
            }
            else {
                // Insert error message in button
                document.querySelector('#price').innerHTML = 'Error retrieving price';

                this.displayAlert(serverResponse.message);

                //Removes form action url
                document.querySelector('#order-form').action = '#';

                // Prevents form from reloading the page if server does not return valid product
                document.querySelector('#order-form').onsubmit = e => {
                    e.preventDefault();
                }
            }
        }

        console.log(`Sending to server: ${data.category},  ${data.size} and ${data.product}`)
        // Requests price information to server
        request.send(JSON.stringify(data));
    },
    // Get CSRF token from cookie
    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    },
    // Stores order data into localStorage
    setStorage(slug, price, name) {

        let quantity = parseInt(document.querySelector('#id_quantity').value);

        let selectedToppings = Cart.addToppings();

        // Find if order with the same slug and toppings exists
        // Returns the product as a object, if exists, returns undefined if not
        let containsOrder = Cart.containsItem(slug, selectedToppings);

        console.log(`Type of containsOrder is ${typeof containsOrder}`)

        // If containsOrder returns 0 or higher number, an exact product already exists in cart
        if (containsOrder >= 0) {
            // If order exists, just add to quantity
            console.log('Adding to existing order')
            // Find the existing product in cart by its index, sum to the existing quantity
            Cart.orders[containsOrder]['quantity'] += quantity;
            Cart.saveOrder();

        } else {
            // If order do not exist, containsOrder will return -1
            console.log('creating new order')

            let order = {
                'name': name,
                'price': price,
                'quantity': quantity,
                'slug':slug,
                'toppings': Cart.addToppings(),
            }

            Cart.orders.push(order);
            localStorage.setItem('orders', JSON.stringify(Cart.orders));
        }
    },
    addToppings() {
        // Checks if there are checked toppings, if yes, adds to array, returns array
        let resultArr = [];
        let toppings = document.querySelectorAll('.form-check-input');
        let filtered = toppings.forEach(topping => {
            if (topping.checked) {
                // If a topping checkbox is checked, add to array
                resultArr.push(topping.value);
            }
        })
        return resultArr;
    },
    containsItem(slug, toppings) {
        // Checks if Cart.orders contains a slug and exact array of toppings, if yes, returns true, otherwise, false
        return Cart.orders.findIndex(order => order.slug === slug && JSON.stringify(order.toppings) === JSON.stringify(toppings))
    },
    displayAlert(message) {
        // Display alert in page
        let alertElement = document.getElementById('alertMessage');
        alertElement.textContent = message;

        // Scrolls to top of page
        window.scrollTo(0, 0);

        // Alert fades away after 3 seconds
        $('#alertSystem').fadeTo(1, 1).show();
        setTimeout(function() {
            $("#alertSystem").fadeTo(500, 0).slideUp(500, function(){
                $(this).hide();
            });
        }, 3000);
    },
    priceToppings() {
        // If topping box is checked or unchecked after product size or type is changed, update item price accordingly
        const subToppings = document.getElementsByName('sub_toppings');

        if (subToppings.length > 0) {
            subToppings.forEach(topping => {
                // If a topping box is checked, sum to product price, if unchecked, subtract from price
                if (topping.checked) {
                    let toppingPrice = topping.getAttribute('data-price');
                    let oldPrice = document.getElementById('price').innerHTML;
                    let result = parseFloat(oldPrice) + parseFloat(toppingPrice);
                    // Gets float result and convert to string with 2 decimal places
                    document.getElementById('price').innerHTML = result.toFixed(2);
                }
            });
        }
    },
    checkSubToppings() {
        console.log('Checking sub toppings');
        // If toppings checkbox is checked, add to price and to data field, if unchecked, subtract from price and remove from Data
        const subToppings = document.getElementsByName('sub_toppings');
        if (subToppings.length > 0) {
            subToppings.forEach(topping => {
                topping.addEventListener('change', () => {
                    // If a topping box is checked, sum to product price, if unchecked, subtract from price
                    if (topping.checked) {
                        let attribute = topping.getAttribute('data-price');
                        let toppingName = topping.getAttribute('value');
                        let oldPrice = document.getElementById('price').innerHTML;
                        let result = parseFloat(oldPrice) + parseFloat(attribute);
                        // Gets float result and convert to string with 2 decimal places
                        document.getElementById('price').innerHTML = result.toFixed(2);
                    } else {
                        let attribute = topping.getAttribute('data-price');
                        let oldPrice = document.getElementById('price').innerHTML;
                        let result = parseFloat(oldPrice) - parseFloat(attribute);
                        // Gets float result and convert to string with 2 decimal places
                        document.getElementById('price').innerHTML = result.toFixed(2);
                    }
                })
            })
        }
    },
    // Given a Pizza type, check if user has selected the exact number of allowed toppings
    checkPizzaToppings() {
        // Get the number of toppings for a given Pizza type
        let max = this.maxToppings();
        // Get the topping checkboxes that are checked
        checkedToppings = document.querySelectorAll('.form-check-input:checked');
        // If not exact number of toppings, return false
        if (checkedToppings.length > max || checkedToppings.length < max) {
            return false;
        }
        return true;
    },
    // Returns the number of toppings that needs to be checked depending on each pizza topping type
    maxToppings() {
        let toppingValue = document.getElementById('id_topping').value;

        switch (toppingValue) {
            case 'CH':
                return 0;
                break;
            case '1T':
                return 1;
                break;
            case '2T':
                return 2;
                break;
            case '3T':
                return 3;
                break;
            case 'SP':
                return 5;
                break;
        }
    },
    displayPizzaToppingMessage() {
        // Select small text under the topping select box
        let smallText = document.getElementById('hint_id_topping');
        let message = `You can add ${this.maxToppings()} toppings`;
        smallText.innerHTML = message;
    },
    setProductImage(link) {
        let image = document.querySelector('#product-image');
        image.setAttribute('src', link);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Hides alert
    $('#alertSystem').hide();

    // Initialize Cart functions
    Cart.init();
});
