from django import forms
from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from django.contrib import messages

from orders.forms import PizzaForm, PizzaToppingForm, SubToppingForm
from orders.models import Product, PizzaTopping

from carts.models import CartItem

# Adds a product to cart
def add(request, slug):
    if request.method == 'POST':
        print(f'{request.POST}')
        form_pizza = PizzaForm(request.POST)
        form_topping = PizzaToppingForm(request.POST)

        if form_pizza.is_valid() and form_topping.is_valid():
            pizza_data = form_pizza.cleaned_data
            topping_data = form_topping.cleaned_data
            print(f"Pizza data: {pizza_data}, toppings: {topping_data}")

            # Query product with slug and get child model instance
            try:
                query_product = Product.objects.get_subclass(slug=slug)
            except Product.DoesNotExist:
                messages.error(request, f'Error: Pizza does not exist')
                return redirect('custom-pizza')

            cart_item = CartItem.objects.create(item=query_product, quantity=1)
            # if toppings were selected, otherwise
            if topping_data['name'].exists():
                for topping in topping_data['name']:
                    try:
                        query_topping = PizzaTopping.objects.get(name=topping)
                        print(query_topping)
                    except  PizzaTopping.DoesNotExist:
                        messages.error(request, f'Error: Topping does not exist')
                        return redirect('custom-pizza')

                    cart_item.pizza_toppings.add(query_topping)

                messages.success(request, f'Pizza: {query_product} - toppings: {" - ".join([str(topping) for topping in topping_data["name"]])} added to cart')
                return redirect('custom-pizza')
            else:
                messages.success(request, f'Pizza: {query_product} added to cart')
                return redirect('custom-pizza')

        else:
            print(f"Invalid form: {form_pizza.errors}")
            messages.error(request, f'Invalid forms')
            return redirect('custom-pizza')

    else:
        return HttpResponse('Not cart')

def remove(request):
    pass

def hello(request):
    return HttpResponse('HI')

def cart(request):
    if request.method == 'POST':
        pass
    else:
        # context = {
        #     "Cart"
        # }
        return render(request, 'carts/cart.html')
