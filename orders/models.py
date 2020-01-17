from django.db import models

# Create your models here.
class Food(models.Model):
    quantity = models.IntegerField()

class Topping(models.Model):
    name = models.CharField(max_length=64)


class Pizza(models.Model):
    toppings = models.ManyToManyField(Topping)
    price = models.DecimalField(max_digits=100, decimal_places=2)

class Cart(models.Model):
    pass
