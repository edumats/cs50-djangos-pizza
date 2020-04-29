from django.urls import path
# This import is from orders module
from . import views as cart_views

urlpatterns = [
    path("", cart_views.cart, name="cart"),
    path("remove/", cart_views.remove, name="remove"),
    path("hello/", cart_views.hello, name="hello"),
]
