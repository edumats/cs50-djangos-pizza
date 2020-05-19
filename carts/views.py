from django import forms
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, HttpResponse, JsonResponse
from django.urls import reverse
from django.contrib import messages

import json

from orders.forms import PizzaForm, PizzaToppingForm, SubToppingForm
from orders.models import Product, PizzaTopping

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
            print('Not logged in')
            return JsonResponse({
                'success': False
            })

        string_data = json.loads(request.body)
        orders = json.loads(string_data['data'])

        cart = Cart.objects.create(user=request.user)

        for order in orders:
            try:
                product = Product.objects.get_subclass(slug=order['slug'])
            except Product.DoesNotExist:
                messages.error(request, f'Error: Pizza does not exist')
                return redirect('cart')

            cart_item = CartItem.objects.create(item=product, quantity=order['quantity'])
            cart.items.add(cart_item)

        return JsonResponse({
            'success':True,
            'message': 'Order sent'
        })

    else:
        print('received via GET ')
