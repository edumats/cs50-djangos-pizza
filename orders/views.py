from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from django.http import Http404

# For getting model names
from django.apps import apps

from .models import *

# Create your views here.
def index(request):
    if not request.user.is_authenticated:
        return render(request, "users/login.html", {"message": None})

    # To get list of model names
    apps.all_models['orders']

    dishes = {
        "simple_dishes": {
            "Subs": Sub.objects.all(),
            "Pasta": Pasta.objects.all(),
            "Salads": Salad.objects.all(),
            "Dinner Platters": Dinner.objects.all()
        },
        "Pizzas": Pizza._meta.get_field('type').choices
    }
    return render(request, "orders/index.html", dishes)

def products(request, slug):
    # Try to get Product subclass by slug
    try:
        product = Product.objects.get_subclass(slug=slug)
    except Product.DoesNotExist:
        raise Http404("No Product matches given that query")

    context = {
        "product": product,
        "PizzaToppings": PizzaTopping.objects.all(),
        "SubToppings": SubTopping.objects.all(),
        "SubSizes": Sub._meta.get_field('size').choices,
        "PizzaSizes": Pizza._meta.get_field('size').choices,
        "DinnerSizes": Dinner._meta.get_field('size').choices,
        "type": product.__class__.__name__ # Gets class name
    }
    return render(request, "orders/product.html", context)
