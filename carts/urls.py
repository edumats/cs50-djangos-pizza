from django.urls import path
# This import is from orders module
from . import views as cart_views

urlpatterns = [

    path("add/", cart_views.add, name="add"),
    path("", cart_views.cart, name="cart"),
]
