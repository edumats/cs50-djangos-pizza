from django.db import models
from model_utils.managers import InheritanceManager

class Product(models.Model):
    name = models.CharField(max_length=100, blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    slug = models.SlugField(max_length=120, unique=True)
    description = models.CharField(max_length=500, blank=True)
    created = models.DateTimeField(auto_now_add=True)

    # for the django-model-utils InheritanceManager to work
    # https://django-model-utils.readthedocs.io/en/latest/managers.html#inheritancemanager
    objects = InheritanceManager()

    # # for the downcast function to work
    # _downcast = None

    def __str__(self):
        return f"{self.name}"

    def get_absolute(self):
        return f"/products/{self.slug}"

    # # used downcast function https://stackoverflow.com/questions/28822065/access-child-methods-in-python-django
    # def downcast(self):
    #     if self._downcast is None:
    #         if hasattr(self, 'sub'):
    #             self._downcast = self.sub
    #
    #     return self._downcast


class Dinner(Product):
    DINNER_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]
    size = models.CharField(max_length=1, choices=DINNER_SIZES, help_text="Choose the size")
    type = models.ForeignKey('DinnerType', on_delete=models.CASCADE, related_name='dinnertype')

    def __str__(self):
        return f"{self.name} - Size: {self.size} - $ {self.price}"


class DinnerType(models.Model):
    name = models.CharField(max_length=70)
    image = models.URLField(default='https://via.placeholder.com/150')

    def __str__(self):
        return self.name

    def get_absolute(self):
        return f"/products/dinner/{self.name}/customize"


class Salad(Product):
    image = models.URLField(default='https://via.placeholder.com/150')
    def __str__(self):
        return f"{self.name} - $ {self.price}"

    def get_absolute(self):
        return f"/products/salad/{self.slug}"

class Pasta(Product):
    image = models.URLField(default='https://via.placeholder.com/150')
    def __str__(self):
        return f"{self.name} - $ {self.price}"

    def get_absolute(self):
        return f"/products/pasta/{self.slug}"

class Pizza(Product):
    PIZZA_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]
    PIZZA_TOPPINGS = [
        ('CH', 'Cheese'),
        ('1T', '1 Topping'),
        ('2T', '2 Toppings'),
        ('3T', '3 Toppings'),
        ('SP', 'Special')
    ]

    type =  models.ForeignKey('PizzaType', on_delete=models.CASCADE, related_name='pizzatype')
    topping = models.CharField(max_length=2, choices=PIZZA_TOPPINGS, help_text="How many toppings?", default='S')
    size = models.CharField(max_length=1, choices=PIZZA_SIZES, help_text="Choose your Pizza Size", default='CH')

    def __str__(self):
        return f"{self.name} - Size: {self.size} : $ {self.price}"

class PizzaType(models.Model):
    name = models.CharField(max_length=70)
    image = models.URLField(default='https://via.placeholder.com/150')

    def __str__(self):
        return self.name

    def get_absolute(self):
        return f"/products/pizza/{self.name}/customize"


class PizzaTopping(models.Model):
    name = models.CharField(max_length=70, help_text="Choose your toppings")

    def __str__(self):
        return f"{self.name}"


class Sub(Product):
    SUB_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]
    type = models.ForeignKey('SubType', on_delete=models.CASCADE, related_name='subtype')
    size = models.CharField(max_length=1, choices=SUB_SIZES, help_text="Choose the Sub size", default='S')

    def __str__(self):
        return f"{self.name} - Size: {self.size} : $ {self.price}"


class SubType(models.Model):
    name = models.CharField(max_length=70)
    image = models.URLField(default='https://via.placeholder.com/150')

    def __str__(self):
        return self.name

    def get_absolute(self):
        return f"/products/sub/{self.name}/customize"


class SubTopping(models.Model):
    name = models.CharField(max_length=70, help_text="Choose your toppings")
    price = models.DecimalField(max_digits=5, decimal_places=2, help_text="Topping price")

    def __str__(self):
        return f"{self.name}"
