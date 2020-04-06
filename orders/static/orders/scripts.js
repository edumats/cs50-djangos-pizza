// Create object with values to be submitted
// Send default values to quote for a price
// If select box changes, update object
// Requote for price

document.addEventListener('DOMContentLoaded', () => {
    const data = {};
    // Sets default values into object and query initial price
    document.querySelectorAll('select').forEach(item => {
        data[item.name] = item.value;
    });
    requestAjax()

    // If select box changes, update object and query again for price
    document.querySelectorAll('select').forEach((item) => {
        item.onchange = () => {
            data[item.name] = item.value;
            console.log(data);
        };
    });

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
        var csrftoken = getCookie('csrftoken');
        console.log(`token: ${csrftoken}`)

        // Initiate new request
        const request = new XMLHttpRequest();
        request.open('POST', '../check-price/', true);

        request.setRequestHeader('X-CSRFToken', csrftoken);
        request.setRequestHeader('contentType', 'application/json; charset=utf-8');

        // Callback function for when request completes
        request.onload = () => {
            const serverResponse = JSON.parse(request.responseText);

            if (serverResponse.success) {
                console.log(serverResponse.price);
                content = `Add $${serverResponse.price}`;
                document.querySelector('#order-button').innerHTML = content;
            }
            else {
                document.querySelector('#order-button').innerHTML = 'Error retrieving price';
            }
        }

        console.log(`We are sending: ${data.type},  ${data.size} and ${data.topping}`)
        // Sends data to server
        request.send(JSON.stringify(data));

    }
});
