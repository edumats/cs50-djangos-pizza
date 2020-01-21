from django.db import models
from django.contrib.auth.models import User

class Food(models.Model):
    name = models.CharField(max_length=70)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.name} {self.price}"

class Dinner(models.Model):
    DINNER_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]
    name = models.ForeignKey('Food', on_delete=models.CASCADE, related_name="dinners")
    size = models.CharField(max_length=1, choices=DINNER_SIZES)


class Salad(models.Model):
    name = models.ForeignKey('Food', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=5, decimal_places=2)

class Pasta(models.Model):
    name = models.ForeignKey('Food', on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=5, decimal_places=2)

class Pizza(models.Model):
    PIZZA_CHOICES = [
        ('RP', 'Regular Pizza'),
        ('SP', 'Sicilian Pizza')
    ]
    PIZZA_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]
    size = models.CharField(max_length=1, choices=PIZZA_SIZES)
    type = models.ManyToManyField('Pizza_Type')
    price = models.DecimalField(max_digits=5, decimal_places=2)
    toppings = models.ManyToManyField('Pizza_Topping')

class Pizza_Topping(models.Model):
    name = models.CharField(max_length=70)

class Pizza_Type(models.Model):
    name = models.CharField(max_length=70)

class Sub(models.Model):
    SUB_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]
    size = models.CharField(max_length=1, choices=SUB_SIZES)
    name = models.ForeignKey('Food', on_delete=models.CASCADE)
    type = models.ForeignKey('Sub_Type', on_delete=models.CASCADE)
    topping = models.ManyToManyField('Sub_Topping')
    price = models.DecimalField(max_digits=5, decimal_places=2)

class Sub_Topping(models.Model):
    name = models.CharField(max_length=70)
    price = models.DecimalField(max_digits=5, decimal_places=2)

class Sub_Type(models.Model):
    name = models.CharField(max_length=70)
