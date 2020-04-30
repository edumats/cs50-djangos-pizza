// Create object with values to be submitted
// Send default values to quote for a price
// If select box changes, update object
// Requote for price

document.addEventListener('DOMContentLoaded', () => {

    // Data object to be sent to server
    const data = {};
    const category = document.getElementById('category').textContent;
    const product = document.getElementById('product').textContent;

    // Remove ' or " from product and category
    data['category'] = category.replace(/['"]+/g, '');
    data['product'] = product.replace(/['"]+/g, '');

    // Sets default select values into object and query initial price
    document.querySelectorAll('select').forEach(item => {
        data[item.name] = item.value;
    });

    // Send and receive data using AJAX
    requestAjax()

    // If toppings checkbox is checked, add to price and to data field, if unchecked, subtract from price and remove from Data
    checkSubToppings();

    // If select box changes, update object and query again for price
    // Could be included on function above
    document.querySelectorAll('select').forEach(item => {
        item.onchange = () => {
            data[item.name] = item.value;
            requestAjax();
        };
    });
    // Retrieves CSRF data from cookie
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    function requestAjax() {
        // Gets token from cookie to pass CSRF check for POST requests
        var csrftoken = getCookie('csrftoken');

        // Initiate new request
        const request = new XMLHttpRequest();
        request.open('POST', '../../../check-price/', true);

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

                // Add slug and quantity to localStorage when submit button is clicked
                submitButton.addEventListener('click', event => {
                    event.preventDefault();
                    setStorage(serverResponse.slug, serverResponse.price, serverResponse.name);
                });

                // Enables form to send data again, if blocked before
                document.querySelector('#order-form').onsubmit = e => {
                    e.returnValue = true;
                };
            }
            else {
                // Insert error message in button
                document.querySelector('#order-button').innerHTML = 'Error retrieving price';

                // Cleans price
                document.querySelector('#price').innerHTML = '';

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

    }
});


function setStorage(slug, price, name) {
    // Stores order data into localStorage
    console.log('Adding to localStorage');
    let quantity = document.querySelector('#id_quantity').value;
    let order = {
        'name': name,
        'price': price,
        'quantity': quantity,
        'slug':slug
    }
    if (localStorage.getItem('orders')) {
        let retrievedOrderArray = JSON.parse(localStorage.getItem('orders'));
        retrievedOrderArray.push(order);
        localStorage.setItem('orders', JSON.stringify(retrievedOrderArray));
    } else {
        let newOrderArray = [];
        newOrderArray.push(order);
        localStorage.setItem('orders', JSON.stringify(newOrderArray));
    }
}


function checkSubToppings() {
    // If toppings checkbox is checked, add to price and to data field, if unchecked, subtract from price and remove from Data
    const subToppings = document.getElementsByName('sub_toppings');
    if (subToppings.length > 0) {
        subToppings.forEach(topping => {
            topping.addEventListener('change', () => {
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

function checkIfOrderExists(arr, slug) {
    arr.forEach(order => {
        if (order.slug === slug) {
            return true;
        } else {
            return false;
        }
    })
}
