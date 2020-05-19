// Creates Cart object
const Cart = {
    // Stores the orders as objects
    orders: [],
    // Gets data from local storage, converts to Json and stores in orders. If no localStorage, display message
    init() {
        let contents = localStorage.getItem('orders');
        if (contents) {
            Cart.orders = JSON.parse(contents);
        } else {
            console.log('No orders');
        }
    },
    // Gets total of all order items
    sumOrders() {
        let orderTotal = document.querySelector('#order-total');
        let total = 0;
        this.orders.forEach(item => {
            total += parseFloat(item.price);
        })
        orderTotal.innerHTML = total.toFixed(2);
    },
    // Sync order from memory to localStorage
    syncOrders(orders=Cart.orders) {
        let cart = JSON.stringify(orders);
        localStorage.setItem('orders', cart);
    },
    // Find an specific order
    findOrder(slug) {
        let found = Cart.orders.filter(order => {
            if (order.slug === slug) {
                return true;
            }
        })
        return found;
    },
    // Change order quantity by giving its slug
    changeQtyOrder(slug, qty) {
        Cart.orders.find(order => {
            if (order.slug == slug) {
                order.quantity = qty;
                Cart.syncOrders();
                // Sum orders again
            }
        });
    },
    // Delete order and update localStorage by giving a slug
    deleteOrder(slug) {
        let updatedCart = Cart.orders.filter(order => {
            return order.slug !== slug
        });
        Cart.syncOrders(updatedCart);
    },
    cartHasItems() {
        let orders = localStorage.getItem('orders');
        if (orders.length > 0) {
            return true;
        } else {
            return false;
        }
    },
    // Sends data to server using Ajax
    requestAjax(data) {
        var csrftoken = Cart.getCookie('csrftoken');

        // Initiate new request
        const request = new XMLHttpRequest();
        request.open('POST', '/cart/add/', true);

        // Set request header with CSRF token code
        request.setRequestHeader('X-CSRFToken', csrftoken);
        request.setRequestHeader('contentType', 'application/json; charset=utf-8');

        // Callback function for when request completes
        request.onload = () => {
            const serverResponse = JSON.parse(request.responseText);
            // Display boostrap alert
            if (serverResponse.success) {
                console.log(`Server returned a response`);
                // Display alert
                Cart.displayAlert(serverResponse.message);

            }
            else {
                // Insert error message in button
                console.log('No response from server')
                Cart.displayAlert('No response from server');
            }
        }

        console.log(`Sending to server...`)
        // Sends data to server
        let order_data = {'data': data}
        request.send(JSON.stringify(order_data));
    },
    // Get CSRF token from cookie
    getCookie(name) {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            let cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
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
    displayAlert(message) {
        let alertElement = document.getElementById('alertMessage');
        alertElement.textContent = message;
        // alertElement.classList.add('alert-primary');
        $('#alertSystem').fadeTo(1, 1).show();
        setTimeout(function() {
            $("#alertSystem").fadeTo(500, 0).slideUp(500, function(){
                $(this).hide();
            });
        }, 3000);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    $('#alertSystem').hide();
    Cart.init();
    // Needs something when cart is empty
    Cart.sumOrders();

    console.log('This is the carts js file');

    showCart();
    changeQuantity();
    sendOrder();
});

function showCart() {
    let orderDetails = document.querySelector('#order-details');
    // Loop over all orders. For each order, do something
    Cart.orders.map(order => {
        let tableRow = document.createElement('tr');
        tableRow.dataset.id = order['slug'];
        orderDetails.appendChild(tableRow);

        // Get keys from object and remove the slug key
        let keys = Object.keys(order);

        // Loop over remaining keys and populate table
        for (i = 0; i < keys.length; i++) {
            // If quantity key is found, create a select field instead
            if (keys[i] === 'quantity') {
                createSelect(order[keys[i]], tableRow, order['slug']);
                continue;
            }
            // If slug key is found, do nothing
            if (keys[i] === 'slug') {
                continue;
            }
            let productCell = document.createElement('td');
            productCell.innerHTML = order[keys[i]];
            tableRow.appendChild(productCell);
        }
        createDeleteElement(order['slug'], tableRow);
    })
}


// Creates the Cart item delete button
function createDeleteElement(slug, parent) {
    let td = document.createElement('td');
    let a = document.createElement('a')
    td.appendChild(a);
    a.setAttribute('href', '#');
    a.dataset.id = slug;
    a.innerHTML = 'Exclude';
    parent.appendChild(td);
    a.onclick = () => {
        a.parentNode.parentNode.remove();
        Cart.deleteOrder(slug);
    }
};


// Creates select box with quantity options
function createSelect(quantity, parent, slug) {
    let select = document.createElement('select');
    select.dataset.id = slug;
    select.setAttribute('class', 'select-quantity');
    let td = document.createElement('td');
    // Creates options up to 10
    for (i = 1; i <= 10; i++) {
        let option = document.createElement('option');
        option.value = i;
        option.innerHTML = i;
        // If created quantity option matches the actual product quantity, select it
        if (i === parseInt(quantity)) {
            option.selected = true;
        }
        select.appendChild(option);
    }
    td.appendChild(select);
    parent.appendChild(td);
}


function changeQuantity() {
    let selects = document.querySelectorAll('.select-quantity');
    selects.forEach(select => {
        select.addEventListener('change', () => {
            let quantity = select.value;
            let slug = select.dataset.id;
            Cart.changeQtyOrder(slug, quantity);
        })
    })
}

function sendOrder() {
    let button = document.querySelector('#confirm-order');
    let orders = localStorage.getItem('orders');
    button.addEventListener('click', () => {
        Cart.requestAjax(orders);
    })
}
