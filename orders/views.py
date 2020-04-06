from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.http import Http404, JsonResponse
import json

from .forms import PizzaForm, PizzaToppingForm, SubForm, SubToppingForm

# For getting model names
from django.apps import apps

from .models import *

# Create your views here.
def index(request):
    if not request.user.is_authenticated:
        return render(request, "users/login.html", {"message": None})

    dishes = {
        "simple_dishes": {
        # In some queries, there is a .filter(size='S') to remove duplicates from the menu
            "Subs": Sub.objects.filter(size='S'),
            "Pasta": Pasta.objects.all(),
            "Salads": Salad.objects.all(),
            "Dinner Platters": Dinner.objects.filter(size='S')
        },
    }
    return render(request, "orders/index.html", dishes)

def products(request, slug):
    # Try to get Product subclass name by slug
    try:
        product = Product.objects.get_subclass(slug=slug)
    except Product.DoesNotExist:
        raise Http404("No Product matches given that query")

    context = {
        "product": product,
        "SubForm": SubForm(),
        "SubToppingForm": SubToppingForm(),
        "DinnerSizes": Dinner._meta.get_field('size').choices,
        "type": product.__class__.__name__ # Gets class name
    }
    return render(request, "orders/product.html", context)

# Displays page of customizing pizzas
def custom_pizza(request):
    context = {
        "PizzaForm": PizzaForm(),
        "PizzaToppingForm": PizzaToppingForm()
    }
    return render(request, "orders/custom-pizza.html", context)

# Returns price when customizing a product
def check_price(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        print(data)

        # type = request.POST.get("type")
        # size = request.POST.get("size")
        # topping = request.POST.get("topping")
        # print(f"{type} {size} {topping}")
        try:
            pizza = Pizza.objects.get(type=data.get('type'), size=data.get('size'), topping=data.get('topping'))
            print(pizza)
        except Pizza.DoesNotExist:
            return JsonResponse({'price': 'Not found'})
    return JsonResponse({'price': pizza.price, 'success':True})

def hello(request):
    return HttpResponse('Hello')
