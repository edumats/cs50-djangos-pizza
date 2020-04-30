// Creates Cart object
const Cart = {
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
        orderTotal.innerHTML = total;
    },
    // Sync order from memory to localStorage
    syncOrders() {
        let cart = JSON.stringify(Cart.orders);
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
    changeQtyOrder(slug, qty) {
        Cart.orders.map(order => {
            if (order.slug === slug) {
                order.quantity = qty;
            } else {
                console.log('No order to change quantity');
            }
        })
    }
}


document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
    // Needs something when cart is empty
    Cart.sumOrders();

    console.log('This is the carts js file');

    showCart();
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


function changeQuantity() {
    document.querySelectorAll('.input-quantity').forEach(input => {
        input.addEventListener('change')
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
        a.parentNode.remove();
    }
};


// Creates select box with quantity options
function createSelect(quantity, parent, slug) {
    let select = document.createElement('select');
    select.dataset.id = slug;
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
