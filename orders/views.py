from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.http import Http404, JsonResponse
from django.core.exceptions import ObjectDoesNotExist
import json

from .forms import PizzaForm, PizzaToppingForm, SubToppingForm, SubSizeForm, CartQuantity

# For getting model names
from django.apps import apps

from .models import *

# Create your views here.
def index(request):
    # if not request.user.is_authenticated:
    #     return render(request, "users/login.html", {"message": None})

    dishes = {
        "simple_dishes": {
            # When there is customization, use Type model to show the available options
            "Pizza": PizzaType.objects.all(),
            "Subs": SubType.objects.all(),
            "Pasta": Pasta.objects.all(),
            "Salads": Salad.objects.all(),
            "Dinner Platters": DinnerType.objects.all()
        },
    }
    return render(request, "orders/index.html", dishes)

def products(request, slug, category):
    print('In products view')
    # Try to get Product subclass name by slug
    try:
        product = Product.objects.get_subclass(slug=slug)
    except Product.DoesNotExist:
        raise Http404("No Product matches given that query")

    context = {
        "product": product.name,
        "SubToppingForm": SubToppingForm(),
        "SubSizeForm": SubSizeForm(),
        "DinnerSizes": Dinner._meta.get_field('size').choices,
        "category": product.__class__.__name__, # Gets class name
        "CartQuantity": CartQuantity()
    }
    return render(request, "orders/custom.html", context)


# Returns price when customizing a product
def check_price(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(f'Receiving: {data}')
        if data.get('category') == 'Sub':
            try:
                type = SubType.objects.get(name=data.get('product'))
                product = Sub.objects.get(type=type, size=data.get('size'))
                print(product)
            except ObjectDoesNotExist:
                return JsonResponse({'price': 'Not found'})
        elif data.get('category') == 'Pizza':
            try:
                type = PizzaType.objects.get(name=data.get('product'))
                product = Pizza.objects.get(type=type, size=data.get('size'), topping=data.get('topping'))
                print(product)
            except ObjectDoesNotExist:
                return JsonResponse({'price': 'Not found'})
        elif data.get('category') == 'Dinner':
            try:
                type = DinnerType.objects.get(name=data.get('product'))
                product = Dinner.objects.get(type=type, size=data.get('size'))
                print(product)
            except ObjectDoesNotExist:
                return JsonResponse({'price': 'Not found'})
        else:
            # Used for categories that already has defined a slug
            # aka not customizable products
            try:
                product = Product.objects.get(slug=data.get('product'))
            except ObjectDoesNotExist:
                return JsonResponse({'price': 'Not found'})
    return JsonResponse({
        'price': product.price,
        'slug': product.slug ,
        'name': product.name,
        'success':True
    })


def custom(request, category, product):
    print('In custom view')
    # View for products that haven't determined its slug yet
    # User needs to select options to determine its slug

    context = {
        "category": category.capitalize(),
        "product": product,
        "PizzaForm": PizzaForm(),
        "PizzaToppingForm": PizzaToppingForm(),
        "SubToppingForm": SubToppingForm(),
        "SubSizeForm": SubSizeForm(),
        "CartQuantity": CartQuantity()
    }
    return render(request, "orders/custom.html", context)
