from django.urls import path
# This import is from orders module
from . import views

urlpatterns = [
    path("check-price/", views.check_price, name="check-price"),
    path("<category>/<slug:slug>/", views.products, name="products"),
    path("<category>/<product>/customize/", views.custom, name="custom"),

]
