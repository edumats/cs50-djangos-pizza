from django import forms
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.urls import reverse
from django.contrib import messages

import json

from orders.forms import PizzaForm, PizzaToppingForm, SubToppingForm
from orders.models import Product, PizzaTopping, SubTopping, Sub, Pizza

from carts.models import CartItem, Cart

from django.views.decorators.csrf import csrf_exempt


def cart(request):
    if request.method == 'POST':
        pass
    else:
        # context = {
        #     "Cart"
        # }
        return render(request, 'carts/cart.html')


# Adds a product to cart
def add(request):
    if request.method == 'POST':
        if request.user.is_authenticated:
            print('Logged in')
            print(request.user.username)
        else:
            return JsonResponse({
                'success': False,
                'message': 'Cannot receive order if not logged in'
            })

        # Create a Cart instance
        cart = Cart.objects.create(user=request.user)

        string_data = json.loads(request.body)
        orders = json.loads(string_data['data'])

        # Loop through all order items
        for order in orders:
            try:
                # Get the descendant of the Product that has the following slug
                product = Product.objects.get_subclass(slug=order['slug'])
            except Product.DoesNotExist:
                return JsonResponse({
                    'success': False,
                    'message': f'The product {order["slug"]} in cart does not exist'
                })

            # Create a CartItem instance
            cart_item = CartItem.objects.create(item=product, quantity=order['quantity'])

            # Checks if product is a sub
            if isinstance(product, Sub):
                # Check if product has toppings
                if order['toppings']:
                    # Loop through all toppings in cart item
                    for topping in order['toppings']:
                        try:
                            sub_topping = SubTopping.objects.get(name=topping)
                        except SubTopping.DoesNotExist:
                            return JsonResponse({
                                'success': False,
                                'message': f'Sub topping {topping} in cart does not exist'
                            })
                        # For each topping, add to subtoppings field
                        cart_item.sub_toppings.add(sub_topping)

            if isinstance(product, Pizza):
                # Check if product has toppings
                if order['toppings']:
                    # Loop through all toppings in cart item
                    for topping in order['toppings']:
                        try:
                            pizza_topping = PizzaTopping.objects.get(name=topping)
                        except PizzaTopping.DoesNotExist:
                            return JsonResponse({
                                'success': False,
                                'message': f'Pizza topping {topping} in cart does not exist'
                            })
                        # For each topping, add to subtoppings field
                        cart_item.pizza_toppings.add(pizza_topping)

            # Add cartItem to Cart
            cart.items.add(cart_item)

            # Change Cart status to ordered
            cart.ordered = True
            cart.save()

        return JsonResponse({
            'success':True,
            'message': 'Order sent'
        })

    else:
        print('received via GET ')
