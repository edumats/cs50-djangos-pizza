// Creates Cart object
const Cart = {
    // Stores the orders as objects
    orders: [],
    // Gets data from local storage, converts to Json and stores in orders. If no localStorage, display message
    init() {
        let contents = localStorage.getItem('orders');
        let ordersArr= JSON.parse(contents);
        this.updateCartStatus(ordersArr);
    },
    updateCartStatus(arr=Cart.orders) {
        console.log('Updating cart')
        if (arr.length > 0) {
            this.orders = arr;
            this.sumOrders();
            this.showCart();
            // If item quantity is changed, update cart and local storage
            Cart.changeQuantity();
        } else {
            document.querySelector('#order-details').innerHTML = '<h5>No items in cart</h5>';
            document.querySelector('#order-total').innerHTML = '';
        }
    },
    // Gets total of all order items
    sumOrders() {
        console.log('Summing orders');
        let orderTotal = document.querySelector('#order-total');
        let total = 0;
        this.orders.forEach(item => {
            total += parseFloat(item.price * item.quantity);
        })
        orderTotal.innerHTML = total.toFixed(2);
    },
    // Sync order from memory to localStorage
    syncOrders(orders=Cart.orders) {
        let cart = JSON.stringify(orders);
        // Also updates Cart.orders
        this.orders = orders;

        // Updates local storage
        localStorage.setItem('orders', cart);
    },
    // Find an specific order
    findOrder(slug) {
        let found = this.orders.filter(order => {
            if (order.slug === slug) {
                return true;
            }
        })
        return found;
    },
    // Change order quantity by giving its slug
    changeQtyOrder(slug, quantity, toppings) {
        this.orders.find(order => {
            // If order with same slug and toppings exist, change quantity
            if (order.slug === slug && order.toppings.toString() === toppings) {
                console.log('Order found, changing quantity');
                order.quantity = quantity;
                Cart.syncOrders();
                Cart.updateCartStatus()();
            } else {
                console.log('Not found');
            }
        });
    },
    // Delete order and update localStorage by giving a slug
    deleteOrder(slug) {
        // Returns an array without the deleted item
        let updatedCart = this.orders.filter(order => order.slug !== slug);

        // Sync array as the current cart status
        this.syncOrders(updatedCart);

        this.updateCartStatus();

        this.displayAlert('Item deleted from cart');
    },
    cartHasItems() {
        let orders = this.orders;
        if (orders.length > 0) {
            return true;
        } else {
            return false;
        }
    },
    // Sends data to server using Ajax
    requestAjax(data) {
        var csrftoken = this.getCookie('csrftoken');

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
                this.displayAlert(serverResponse.message);
                Cart.emptyCart();
            }
            else {
                // Display error from server
                this.displayAlert(serverResponse.message);
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
        // Display alert in page
        let alertElement = document.getElementById('alertMessage');
        alertElement.textContent = message;

        // Scrools page to top
        window.scrollTo(0, 0);

        // Alert fades away after 3 seconds
        $('#alertSystem').fadeTo(1, 1).show();
        setTimeout(function() {
            $("#alertSystem").fadeTo(500, 0).slideUp(500, function(){
                $(this).hide();
            });
        }, 3000);
    },
    containsItem(slug, toppings) {
        // Checks if Cart.orders contains a slug and exact array of toppings, if yes, returns true, otherwise, false
        return this.orders.some(order => order.slug === slug && JSON.stringify(order.toppings) === JSON.stringify(toppings))
    },
    emptyCart() {
        console.log('Empty cart');
        this.syncOrders([]);
        document.querySelector('#order-details').innerHTML = '';
        document.querySelector('#order-total').innerHTML = '';
        this.showCart();
    },
    showCart() {
        let orderDetails = document.querySelector('#order-details');
        orderDetails.innerHTML = '';
        // Loop over all orders. For each order, create empty row
        this.orders.map((order, index) => {
            let tableRow = document.createElement('tr');
            tableRow.dataset.id = order['slug'];
            orderDetails.appendChild(tableRow);

            // Get keys from object and remove the slug key
            let keys = Object.keys(order);

            // Loop over keys and populate table
            Object.keys(order).map(key => {
                if (key === 'name' || key === 'price') {
                    let productCell = document.createElement('td');
                    productCell.innerHTML = order[key];
                    if (key === 'name') {
                        productCell.setAttribute('id', index)
                    }
                    tableRow.appendChild(productCell);
                } else if (key === 'quantity') {
                    createSelect(order.quantity, tableRow, order.slug, order.toppings);
                } else if (key === 'toppings') {
                    if (order.toppings.length > 0) {
                        let span = document.createElement('span');
                        span.innerHTML = `<br> Toppings: ${order.toppings}`;
                        targetProductName = document.getElementById(index);
                        targetProductName.appendChild(span);
                    }
                }
            })
            createItemTotal(order['quantity'], order['price'], tableRow);
            createDeleteElement(order['slug'], tableRow);
        })

        // Create Item Total item
        function createItemTotal(quantity, price, parent) {
            let td = document.createElement('td');
            let span = document.createElement('span');
            let total = quantity * price
            span.innerHTML = total.toFixed(2);
            td.innerHTML = '$';
            td.appendChild(span);
            parent.appendChild(td);
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
        function createSelect(quantity, parent, slug, toppings) {
            let select = document.createElement('select');
            select.dataset.id = slug;
            select.dataset.toppings = toppings;
            select.setAttribute('class', 'select-quantity');
            let td = document.createElement('td');
            // Creates options up to 10
            for (let j = 1; j <= 10; j++) {
                let option = document.createElement('option');
                option.value = j;
                option.innerHTML = j;
                // If created quantity option matches the actual product quantity, select it
                if (j === parseInt(quantity)) {
                    option.selected = true;
                }
                select.appendChild(option);
            }
            td.appendChild(select);
            parent.appendChild(td);
        }
    },
    // Send cart items to server
    sendOrder() {
        let button = document.querySelector('#confirm-order');
        button.addEventListener('click', () => {
            if (this.cartHasItems()) {
                let orders = localStorage.getItem('orders');
                Cart.requestAjax(orders);
            } else {
                this.displayAlert('No items in cart')
            }
        })
    },
    changeQuantity() {
        // If product quantity is changed, change qty on local storage
        let selects = document.querySelectorAll('.select-quantity');
        selects.forEach(select => {
            select.addEventListener('change', () => {
                let quantity = select.value;
                let slug = select.dataset.id;
                let toppings = select.dataset.toppings;
                Cart.changeQtyOrder(slug, quantity, toppings);
            })
        })
    }
}


document.addEventListener('DOMContentLoaded', () => {
    // Hides alerts
    $('#alertSystem').hide();

    // Checks if there is a cart data in local storage
    Cart.init();

    // If button is clicked, send order to server
    Cart.sendOrder();
});
