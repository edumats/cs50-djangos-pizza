from django.urls import path
# This import is from orders module
from . import views

urlpatterns = [
    path("check-price/", views.check_price, name="check-price"),
    path("<category>/<product>/customize/", views.custom, name="custom"),
    path("hello/", views.hello, name="hello"),
    path("<slug:slug>/", views.products, name="products"),
]
