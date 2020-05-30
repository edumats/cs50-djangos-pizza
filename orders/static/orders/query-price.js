// Create object with values to be submitted
// Send default values to quote for a price
// If select box changes, update object
// Requote for price


const Cart = {
    // Stores the orders as objects
    orders: [],
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
                console.log(`Server returned: ${serverResponse.price}`);
                // Adds price to submit button
                content = `${serverResponse.price}`;
                document.querySelector('#price').innerHTML = content;

                // Add action url to form
                // document.querySelector('#order-form').action = `../../cart/add/${serverResponse.slug}`;
                document.querySelector('#order-form').action = '#';

                let submitButton = document.querySelector('#order-button');

                // Rechecks if toppings are selected, updates price
                Cart.priceToppings();

                // Add slug and quantity to localStorage when submit button is clicked
                submitButton.addEventListener('click', event => {
                    event.preventDefault();
                    let price = document.querySelector('#price').innerHTML;
                    Cart.setStorage(serverResponse.slug, price, serverResponse.name);
                    Cart.displayAlert('Product added to cart')
                });

                // Enables form to send data again, if blocked before
                document.querySelector('#order-form').onsubmit = e => {
                    e.returnValue = true;
                };
            }
            else {
                // Insert error message in button
                document.querySelector('#price').innerHTML = 'Error retrieving price';

                //Removes form action url
                document.querySelector('#order-form').action = '#';

                // Prevents form from reloading the page if server does not return valid product
                document.querySelector('#order-form').onsubmit = e => {
                    e.preventDefault();
                }
            }
        }

        console.log(`Sending to server: ${data.category},  ${data.size} and ${data.product}`)
        // Sends data to server
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
        let containsOrder = Cart.containsItem(slug, selectedToppings);

        // Change if condition, as it is evaluating trueness of an object
        if (containsOrder) {
            // If order exists, just add to quantity

            Cart.orders.forEach(order => {
                console.log("Adding to existing order")
                order.quantity += quantity;
                Cart.saveOrder();
            })

        } else {
            // If order do not exist, create new order
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
                console.log('Adding topping')
                resultArr.push(topping.value);
            }
        })
        return resultArr;
    },
    containsItem(slug, toppings) {
        // Checks if Cart.orders contains a slug and exact array of toppings, if yes, returns true, otherwise, false
        return Cart.orders.some(order => order.slug === slug && JSON.stringify(order.toppings) === JSON.stringify(toppings))
    },
    displayAlert(message) {
        // Display alert in page
        let alertElement = document.getElementById('alertMessage');
        alertElement.textContent = message;

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
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Hides alert
    $('#alertSystem').hide();

    // Gets cart data from localstorage
    Cart.getOrder();

    // Data object to be sent to server
    const data = {};
    const category = document.getElementById('category').textContent;
    const product = document.getElementById('product').textContent;

    // Remove ' or " from product and category that are in hidden in the page
    data['category'] = category.replace(/['"]+/g, '');
    data['product'] = product.replace(/['"]+/g, '');

    // Sets default select values into object and query initial price
    document.querySelectorAll('select').forEach(item => {
        data[item.name] = item.value;
    });

    // Query for initial item price
    Cart.requestAjax(data)

    // If toppings checkbox is checked, add to price and to data field, if unchecked, subtract from price and remove from Data
    checkSubToppings();

    // If select box changes, update object and query again for price
    // Could be included on function above
    document.querySelectorAll('select').forEach(item => {
        item.onchange = () => {
            data[item.name] = item.value;
            Cart.requestAjax(data);
        };
    });

});

// If topping is checked or unchecked, update price
function checkSubToppings() {
    console.log('Checking toppings');
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
}
