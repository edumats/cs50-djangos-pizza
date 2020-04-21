// Create object with values to be submitted
// Send default values to quote for a price
// If select box changes, update object
// Requote for price

document.addEventListener('DOMContentLoaded', () => {

    // Data object to be sent to server
    const data = {};
    // Sets default select values into object and query initial price
    document.querySelectorAll('select').forEach(item => {
        data[item.name] = item.value;
        console.log(`Whats is item: ${item}`);
        console.log(`Whats is item.name: ${item.name}`);
        console.log(`Whats is item.value: ${item.value}`);
    });
    requestAjax()

    // If select box changes, update object and query again for price
    // Could be included on function above
    document.querySelectorAll('select').forEach((item) => {
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
        request.open('POST', '../check-price/', true);

        // Set request header with CSRF token code
        request.setRequestHeader('X-CSRFToken', csrftoken);
        request.setRequestHeader('contentType', 'application/json; charset=utf-8');

        // Callback function for when request completes
        request.onload = () => {
            const serverResponse = JSON.parse(request.responseText);

            if (serverResponse.success) {
                console.log(`Server returned: ${serverResponse.price}`);
                // Adds price to submit button
                content = `Add to cart $${serverResponse.price}`;
                document.querySelector('#order-button').innerHTML = content;

                //Adds action url to form
                document.querySelector('#order-form').action = `../../cart/add/${serverResponse.slug}`;

                // Enables form to send data again, if blocked before
                document.querySelector('#order-form').onsubmit = e => {
                    e.returnValue = true;
                }
            }
            else {
                document.querySelector('#order-button').innerHTML = 'Error retrieving price';

                //Removes form action url
                document.querySelector('#order-form').action = '#';

                // Prevents form from reloading the page if server does not return valid product
                document.querySelector('#order-form').onsubmit = e => {
                    e.preventDefault();
                }
            }
        }

        console.log(`Sending to server: ${data.type},  ${data.size} and ${data.topping}`)
        // Sends data to server
        request.send(JSON.stringify(data));

    }
});
