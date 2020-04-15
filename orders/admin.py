from django.contrib import admin

from .models import *

# Auto populate the slug field with the field name when adding through admin
class DishAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}

admin.site.register(Salad, DishAdmin)
admin.site.register(Dinner, DishAdmin)
admin.site.register(Pasta, DishAdmin)
admin.site.register(Pizza, DishAdmin)
admin.site.register(PizzaTopping)
admin.site.register(Sub, DishAdmin)
admin.site.register(SubTopping)
admin.site.register(SubType)
admin.site.register(DinnerType)
