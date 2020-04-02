from django.db import models
from model_utils.managers import InheritanceManager

class Product(models.Model):
    name = models.CharField(max_length=100, blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    slug = models.SlugField(max_length=120)
    image = models.URLField(default='https://via.placeholder.com/150')
    description = models.CharField(max_length=500, blank=True)
    created = models.DateTimeField(auto_now_add=True)

    # for the django-model-utils InheritanceManager to work
    objects = InheritanceManager()

    # for the downcast function to work
    _downcast = None

    def __str__(self):
        return f"{self.name}"

    def get_absolute(self):
        return f"/products/{self.slug}" # Remember to add a category before the slug for easier queries

    # used downcast function https://stackoverflow.com/questions/28822065/access-child-methods-in-python-django
    def downcast(self):
        if self._downcast is None:
            if hasattr(self, 'sub'):
                self._downcast = self.sub

        return self._downcast

class Dinner(Product):
    DINNER_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]
    size = models.CharField(max_length=1, choices=DINNER_SIZES, help_text="Choose the size")

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
    PIZZA_TOPPINGS = [
        ('0', 'Cheese'),
        ('1', '1 Topping'),
        ('2', '2 Toppings'),
        ('3', '3 Toppings'),
        ('4', 'Special')
    ]

    type = models.CharField(max_length=1, choices=PIZZA_TYPES, help_text="Regular or Sicilian Pizza?")
    topping = models.IntegerField(choices=PIZZA_TOPPINGS, help_text="How many toppings?")
    size = models.CharField(max_length=1, choices=PIZZA_SIZES, help_text="Choose your Pizza Size")

    def __str__(self):
        return f"{self.get_type_display()} - Size: {self.size} : $ {self.price}"

class PizzaTopping(models.Model):
    name = models.CharField(max_length=70, help_text="Choose your toppings")

    def __str__(self):
        return f"{self.name}"

class Sub(Product):
    SUB_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]

    size = models.CharField(max_length=1, choices=SUB_SIZES, help_text="Choose the size")

    def __str__(self):
        return f"{self.name} - Size: {self.size} : $ {self.price}"

class SubTopping(models.Model):
    name = models.CharField(max_length=70, help_text="Choose your toppings")
    price = models.DecimalField(max_digits=5, decimal_places=2, help_text="Topping price")

    def __str__(self):
        return f"{self.name} : $ {self.price}"
