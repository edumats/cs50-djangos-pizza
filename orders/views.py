from django.contrib.auth import authenticate, login, logout
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render
from django.urls import reverse

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
        "Pizzas": PizzaChoice.objects.all(),
        "Subs": SubType.objects.all(),
        "Pasta": Pasta.objects.all(),
        "Salads": Salad.objects.all(),
        "Dinner Platters": Dinner.objects.all()
    }
    return render(request, "orders/index.html", {"dishes": dishes})

def regular(request):
    return render(request, "orders/regular-pizza.html")
