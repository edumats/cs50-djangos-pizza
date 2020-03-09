from django.db import models


class Product(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    slug = models.SlugField(max_length=120, unique=True)
    image = models.URLField(default='https://via.placeholder.com/150')
    description = models.CharField(max_length=500, blank=True)

    def __str__(self):
        return f"{self.name}"

    def get_absolute(self):
        return f"/products/{self.slug}"

class Dinner(Product):
    DINNER_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]
    size = models.CharField(max_length=1, choices=DINNER_SIZES)

    def __str__(self):
        return f"{self.name} - Size: {self.size} - $ {self.price}"

class Salad(Product):
    def __str__(self):
        return f"{self.name} - $ {self.price}"

class Pasta(Product):
    def __str__(self):
        return f"{self.name} - $ {self.price}"

class Pizza(Product):
    PIZZA_TYPES = [
        ('R', 'Regular'),
        ('S', 'Sicilian')
    ]
    PIZZA_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]

    type = models.CharField(max_length=1, choices=PIZZA_TYPES)
    size = models.CharField(max_length=1, choices=PIZZA_SIZES)
    toppings = models.ManyToManyField('PizzaTopping', related_name='pizzas', blank=True)

    def __str__(self):
        return f"{self.get_type_display()} - Size: {self.size} - Toppings: {' - '.join([str(topping) for topping in self.toppings.all()])} : $ {self.price}"

class PizzaTopping(models.Model):
    name = models.CharField(max_length=70)

    def __str__(self):
        return f"{self.name}"

class Sub(Product):
    SUB_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]

    size = models.CharField(max_length=1, choices=SUB_SIZES)
    toppings = models.ManyToManyField('SubTopping', related_name='subs', blank=True)
    def __str__(self):
        return f"{self.name} - Size: {self.size} - Toppings: {' - '.join([str(topping) for topping in self.toppings.all()])} : $ {self.price}"

class SubTopping(models.Model):
    name = models.CharField(max_length=70)
    price = models.DecimalField(max_digits=5, decimal_places=2)

    def __str__(self):
        return f"{self.name} : $ {self.price}"
