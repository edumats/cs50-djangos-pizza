from django.db import models
from django.contrib.auth.models import User

class Salad(models.Model):
    GARDEN_SALAD = 0
    GREEK_SALAD = 1
    ANTIPASTO = 2
    SALAD_TUNA = 3

    SALAD_CHOICES = [
        (GARDEN_SALAD, 'Garden Salad'),
        (GREEK_SALAD, 'Greek Salad'),
        (ANTIPASTO, 'Antipasto'),
        (SALAD_TUNA, 'Salad w/Tuna')
    ]
    name = models.PositiveSmallIntegerField(choices=SALAD_CHOICES)

class Pasta(models.Model):
    MOZARELLA = 0
    MEATBALLS = 1
    CHICKEN = 2

    PASTA_CHOICES = [
        (MOZARELLA, 'Baked Ziti w/Mozzarella'),
        (MEATBALLS, 'Baked Ziti w/Meatballs'),
        (CHICKEN, 'Baked Ziti w/Chicken')
    ]
    name = models.PositiveSmallIntegerField(choices=PASTA_CHOICES)

class Pizza(models.Model):
    PIZZA_CHOICES = [
        ('RP', 'Regular Pizza'),
        ('SP', 'Sicilian Pizza')
    ]
    PIZZA_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]
    name = models.CharField(max_length=2, choices=PIZZA_CHOICES)
    size = models.CharField(max_length=1, choices=PIZZA_SIZES)
    toppings = models.ManyToManyField('Topping')
    price = models.DecimalField(max_digits=100, decimal_places=2)

class Dinner(models.Model):
    DINNER_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]
    name = models.CharField(max_length=50)


class Cart(models.Model):
    pass

class Sub(models.Model):
    CHEESE = 0
    ITALIAN = 1
    HAM_CHEESE = 2
    MEATBALL = 3
    TUNA = 4
    TURKEY = 5
    CHICKEN_PARMIGIANA = 6
    EGGPLANT_PARMIGIANA = 7
    STEAK = 8
    STEAK_CHEESE = 9
    SAUSAGE_PEPPERS_ONIONS = 10
    HAMBURGER = 11
    CHEESEBURGER = 12
    FRIED_CHICKEN = 13
    VEGGIE = 14

    SUB_CHOICES = [
        (CHEESE, 'Cheese'),
        (ITALIAN, 'Italian'),
        (HAM_CHEESE, 'Ham & Cheese'),
        (MEATBALL, 'Meatball'),
        (TUNA, 'Tuna'),
        (TURKEY, 'Turkey'),
        (CHICKEN_PARMIGIANA, 'Chicken Parmigiana'),
        (EGGPLANT_PARMIGIANA, 'Eggplant Parmigiana'),
        (STEAK, 'Steak Parmigiana'),
        (STEAK_CHEESE, 'Steak + Cheese'),
        (SAUSAGE_PEPPERS_ONIONS, 'Sausage, Peppers & Onions'),
        (HAMBURGER, 'Hamburger'),
        (CHEESEBURGER, 'Cheeseburger'),
        (FRIED_CHICKEN, 'Fried Chicken'),
        (VEGGIE, 'Veggie')
    ]
    name = models.PositiveSmallIntegerField(choices=SUB_CHOICES)

    SUB_SIZES = [
        ('S', 'Small'),
        ('L', 'Large')
    ]
    size = models.CharField(max_length=1, choices=SUB_SIZES)

class Topping(models.Model):
    PEPPERONI = 0
    SAUSAGE = 1
    MUSHROOMS = 2
    ONIONS = 3
    HAM = 4
    CANADIAN_BACON = 5
    PINEAPPLE = 6
    EGGPLANT = 7
    TOMATO_BASIL = 8
    GREEN_PEPPERS = 9
    HAMBURGER = 10
    SPINACH = 11
    ARTICHOKE = 12
    BUFFALO_CHICKEN = 13
    ANCHOVIES = 14
    BLACK_OLIVES = 15
    FRESH_GARLIC = 16
    ZUCCINI = 17
    BARBECUE_CHICKEN = 18

    TOPPING_CHOICES = [
        (PEPPERONI, 'Pepperoni'),
        (SAUSAGE, 'Sausage'),
        (MUSHROOMS, 'Mushrooms'),
        (ONIONS, 'Onions'),
        (HAM, 'Ham'),
        (CANADIAN_BACON, 'Canadian Bacon'),
        (PINEAPPLE, 'Pineapple'),
        (EGGPLANT, 'Eggplant'),
        (TOMATO_BASIL, 'Tomato & Basil'),
        (GREEN_PEPPERS, 'Green Peppers'),
        (HAMBURGER, 'Hamburger'),
        (SPINACH, 'Spinach'),
        (ARTICHOKE, 'Artichoke'),
        (BUFFALO_CHICKEN, 'Buffalo Chicken'),
        (BARBECUE_CHICKEN, 'Barbecue Chicken'),
        (ANCHOVIES, 'Anchovies'),
        (BLACK_OLIVES, 'Black Olives'),
        (FRESH_GARLIC, 'Fresh Garlic'),
        (ZUCCINI, 'Zuccini')
    ]
    name = models.PositiveSmallIntegerField(choices=TOPPING_CHOICES)
