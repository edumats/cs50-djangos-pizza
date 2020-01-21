from django.contrib import admin

from .models import Salad, Dinner, Pasta, Pizza, Sub, Topping
# Register your models here.

admin.site.register(Salad)
admin.site.register(Dinner)
admin.site.register(Pasta)
admin.site.register(Pizza)
admin.site.register(Sub)
admin.site.register(Topping)
