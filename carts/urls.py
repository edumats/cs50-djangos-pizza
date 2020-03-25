from django.urls import path
# This import is from orders module
from . import views
# Imports from users module
from users import views as user_views

urlpatterns = [
    path("add_to_cart", views.add_to_cart, name="add"),
    path("remove_from_cart", views.remove_from_cart, name="remove")
]
