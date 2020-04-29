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

}


document.addEventListener('DOMContentLoaded', () => {
    Cart.init();
    Cart.sumOrders();

    console.log('This is the carts js file');

    showCart();
});

function showCart() {
    let orderDetails = document.querySelector('#order-details');
    Cart.orders.map(order => {
        let tableRow = document.createElement('tr');
        Object.keys(order).map(value => {
            let productCell = document.createElement('td');

            productCell.innerHTML = order[value];
            tableRow.appendChild(productCell);
            orderDetails.appendChild(tableRow);
        })

    })
}


// Creates the Cart item delete button
function createDeleteElement(slug, parent) {
    let a = document.createElement('a')
    a.setAttribute('href', '#');
    a.dataset.id = slug;
    a.innerHTML = 'Exclude';
    parent.appendChild(a);
    a.onclick = () => {
        a.parentNode.remove();
    }
};

// Creates the Cart item qty input field
function createQtyInput(quantity, parent) {
    let input = document.createElement('input');
    input.setAttribute('type', 'number');
    input.setAttribute('value', quantity);
    input.setAttribute('min', 1);
    parent.appendChild(input);
}

function createSelectOptions(quantitySelected) {
    document.querySelectorAll('.select-quantity').forEach(select => {
        console.log(quantitySelected);
        for (i = 1; i <= 10; i++) {
            let option = document.createElement('option');
            option.value = i;
            option.innerHTML = i;

            if (i === parseInt(quantitySelected)) {
                option.setAttribute('selected', 'selected');
            }
            select.appendChild(option);
        }
    })
}


function createRowCell(parent, tableRow, data) {
    let productCell = document.createElement('td');
    productCell.innerHTML = data;
    tableRow.appendChild(productCell);
    parent.appendChild(tableRow);
}
