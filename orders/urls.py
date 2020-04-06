from django.urls import path
# This import is from orders module
from . import views

urlpatterns = [
    path("check-price/", views.check_price, name="check-price"),
    path("hello/", views.hello, name="hello"),
    path("custom-pizza/", views.custom_pizza, name="custom-pizza"),
    path("<slug:slug>/", views.products, name="products"),
]
