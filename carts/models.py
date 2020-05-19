from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator, MaxValueValidator
from orders.models import Product, SubTopping, PizzaTopping

class Cart(models.Model):
    user = models.ForeignKey(
        get_user_model(),
        on_delete=models.CASCADE,
    )
    items = models.ManyToManyField('CartItem', related_name='cart_items')
    created = models.DateTimeField(auto_now_add=True)
    ordered = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.items.all()}"

    def get_total(self):
        total = 0
        for order_item in self.items.all():
            total += order_item.get_total_price()
        return total

class CartItem(models.Model):
    item = models.ForeignKey('orders.Product', on_delete=models.CASCADE, related_name='products')
    sub_toppings = models.ManyToManyField('orders.SubTopping', related_name='subs', blank=True)
    pizza_toppings = models.ManyToManyField('orders.PizzaTopping', related_name='pizzas', blank=True)
    created = models.DateTimeField(auto_now_add=True)
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1), MaxValueValidator(200)])

    def __str__(self):
        if self.sub_toppings.exists():
            return f"{self.item.name} - Sub Toppings: {' - '.join([str(topping) for topping in self.sub_toppings.all()])} - Quantity: {self.quantity}"
        elif self.pizza_toppings.exists():
            return f"{self.item.name} - Pizza Toppings: {' - '.join([str(topping) for topping in self.pizza_toppings.all()])} - Quantity: {self.quantity}"
        else:
            return f"{self.item.name} - No toppings - Quantity: {self.quantity}"

    def get_total_price(self):
        return self.quantity * self.item.price
