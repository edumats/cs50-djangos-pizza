from django.urls import path
# This import is from orders module
from . import views
# Imports from users module
from users import views as user_views

urlpatterns = [
    path("", views.index, name="index"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout"),
    path("register/", user_views.register_view, name="register")
]
