from django.db import models
from django.contrib.auth import get_user_model
from django.core.validators import MinValueValidator
from orders.models import Product

# Create your models here.
class Cart(models.Model):
    user = models.OneToOneField(
        get_user_model(),
        primary_key=True,
        on_delete=models.CASCADE,
    )
    items = models.ManyToManyField(Product)
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    created = models.DateTimeField(auto_now_add=True)
    ordered = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - {self.items.all()}"
