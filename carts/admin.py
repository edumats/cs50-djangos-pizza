from django.contrib import admin
from .models import Cart, CartItem

class TestAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'user', 'completed', 'created')
    list_filter = ('completed',)

    readonly_fields = ['created']

admin.site.register(Cart, TestAdmin)
