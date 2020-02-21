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
    PIZZA_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]
    name = models.ForeignKey('PizzaChoice', on_delete=models.CASCADE, null=True)
    size = models.CharField(max_length=1, choices=PIZZA_SIZES)
    type = models.ForeignKey('PizzaType', on_delete=models.CASCADE, related_name='pizzas', default=0)
    price = models.DecimalField(max_digits=5, decimal_places=2)
    toppings = models.ManyToManyField('PizzaTopping', related_name='pizzas')

    def __str__(self):
        return f"{self.type} - Size: {self.size} - Toppings: {' - '.join([str(topping) for topping in self.toppings.all()])} : $ {self.price}"

class PizzaChoice(models.Model):
    name = models.CharField(max_length=70)
    def __str__(self):
        return f"{self.name}"

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
    name = models.ForeignKey('SubType', on_delete=models.CASCADE, related_name='subs')
    toppings = models.ManyToManyField('SubTopping', related_name='subs')
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.name} - Size: {self.size} - Toppings: {' - '.join([str(topping) for topping in self.toppings.all()])} : $ {self.price}"

class SubTopping(models.Model):
    name = models.CharField(max_length=70)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.name} : $ {self.price}"

class SubType(models.Model):
    name = models.CharField(max_length=70)

    def __str__(self):
        return f"{self.name}"
