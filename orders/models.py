from django.db import models
from django.contrib.auth.models import User

class Dinner(models.Model):
    DINNER_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]
    name = models.CharField(max_length=70)
    size = models.CharField(max_length=1, choices=DINNER_SIZES)
    price = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    def __str__(self):
        return f"{self.name} - Size: {self.size} - $ {self.price}"

class Salad(models.Model):
    name = models.CharField(max_length=70)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.name} - $ {self.price}"

class Pasta(models.Model):
    name = models.CharField(max_length=70)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.name} - $ {self.price}"

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
    type = models.ManyToManyField('PizzaType')
    price = models.DecimalField(max_digits=5, decimal_places=2)
    toppings = models.ManyToManyField('PizzaTopping')

    def __str__(self):
        return f"{self.type} - Size: {self.size} - Toppings: {self.toppings} : $ {self.price}"

class PizzaTopping(models.Model):
    name = models.CharField(max_length=70)

    def __str__(self):
        return f"{self.name}"

class PizzaType(models.Model):
    name = models.CharField(max_length=70)

    def __str__(self):
        return f"{self.name}"

class Sub(models.Model):
    SUB_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]
    size = models.CharField(max_length=1, choices=SUB_SIZES)
    type = models.ForeignKey('SubType', on_delete=models.CASCADE)
    topping = models.ManyToManyField('SubTopping')
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.type} - Size: {self.size} - Toppings: {self.toppings} : $ {self.price}"

class SubTopping(models.Model):
    name = models.CharField(max_length=70)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.name} : $ {self.price}"

class SubType(models.Model):
    name = models.CharField(max_length=70)

    def __str__(self):
        return f"{self.name}"
