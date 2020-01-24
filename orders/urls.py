from django.urls import path

from . import views

from users import views as user_views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", user_views.register_view, name="register")
]
