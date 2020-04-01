from django.urls import path
# This import is from orders module
from . import views


urlpatterns = [
    path("about/", views.about, name="about"),
    path("login/", views.login_view, name="login"),
    path("logout/", views.logout_view, name="logout")
]
