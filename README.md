# Project 3: Django's Pizza

Web Programming with Python and JavaScript

## Installation

Please run pip3 install -r requirements.txt to install all necessary packages.

The package django-model_utils is used to get to the subclasses that inherit from the Product class.

The package django-crispy-forms is used to style the forms that Django generate from the existing models.

## Structure

The Product class contains fields that are common to all products: name, price, slug, description, when it was created

Classes that represent an actual product (Pizza, Sub, Pasta, Dinner, Salad) are subclasses of the Product class. Subclasses contains fields that are specific to a certain dish, like size or type fields.

Dishes that can be customized (in terms of size, number of toppings and toppings) have a foreign field to a Type class (PizzaType, for example) that represent if a Pizza is a Regular Pizza or if a Sub is an Italian Sub. The Django's Pizza main page displays the objects in a Type class in those products where customization is possible.

Note that there are PizzaTopping and Subtopping classes in the orders.models. Those are used only by the CartItems class, on carts.models.

CartItem represents what a item in a cart should have. It is linked to the Product class and has quantity and the toppings fields. Cart class has links to the CartItem and User classes and has fields that help the page administrator control the status of the order, such as if the order has been ordered, when it was ordered and if the order was marked completed by an administrator.

The reason for deciding for this product model structure is being able to represent all the available dishes in the main page in a stage where the user has not decided on the dishes toppings, size or type.

After the user has decided on the size and toppings of the dish and presses the "Add to cart" button, the data is stored locally on the browser on localStorage. It is stored as an object and different products are added in different objects. Adding exactly equal products just updates the quantity on the existing object.

Only after the user has confirmed the order on the cart page, the order data stored on localStorage is sent to server and is checked if the product exists, and if yes, a CartItem object is created, storing the toppings, quantity and changing the item's total price (in case of Sub). The Cart is created, being connected to each CartItem by a Many to Many field.

After the order is sent to server, it appears on the Cart section, on Django's admin page. Now it waits for an administrator to mark it as "Completed".

## Contents

The orders folder contains all components necessary for ordering the dishes. The menu and product pages, url paths, the JavaScript code for managing the orders, as well as the models that define what a Product is and its subclasses (Pizza, Sub, Pasta, etc).

The users folder contains everything related to log in and out the user, mainly the login, registration and logout pages and the form classes related to these pages.

The carts folder contains everything related to a cart, including the cart page, JS logic for cart management, and the Cart and CartItem models.

### Personal Touch

I added a My Orders page that appears once a user is logged in and it shows (if available) all the orders that this specific user has already ordered and their status (whether if the order was completed or it is still in progress). On the Django admin page, the page administrator can see which orders are not completed yet and mark as completed.

##### Special Pizza

The Special Pizza is a pizza with 5 toppings.
