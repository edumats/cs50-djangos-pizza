from django.urls import path
# This import is from orders module
from . import views
# Imports from users module
from users import views as user_views

urlpatterns = [
    path("", views.index, name="index"),
    path("regular-pizza", views.regular, name="regular")
]
