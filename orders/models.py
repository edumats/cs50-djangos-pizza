from django.db import models

# Create your models here.
class Food(models.Model):
    quantity = models.IntergerField()

class Topping(models.Model):
    name = models.CharField(max_length=64)


class Pizza(models.Model):
    toppings = models.ManyToManyField(Topping)

class Order(models.Model):
