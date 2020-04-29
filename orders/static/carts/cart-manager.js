document.addEventListener('DOMContentLoaded', () => {
    console.log('This is the orders js file');
    let orderDetails = document.querySelector('#order-details');

    let orders = JSON.parse(localStorage.getItem('orders'));

    if (orders !== null) {
        orders.forEach(order => {
            let li = document.createElement('li');
            // let div = document.createElement('div');
            let span = document.createElement('span');
            let h6 = document.createElement('h6');
            li.className = 'list-group-item';
            span.innerHTML = 'Quantity: ' + order.quantity;
            console.log(`${order.slug} ${order.name} ${order.price}`)
            h6.innerHTML = order.slug;
            li.appendChild(h6);
            orderDetails.appendChild(li);
            li.appendChild(span);
        })
    } else {
        let li = document.createElement('li');
        li.innerHTML = 'No items in the cart';
        orderDetails.appendChild(li);
    }


})

// createItemElements(content) {
//     let li = document.createElement('li');
//     li.innerHTML = order.slug;
//     orderDetails.appendChild(li);
// }
