from django.forms import ModelForm, RadioSelect, ModelChoiceField
from orders.models import Pizza, PizzaTopping, Sub, SubTopping

class PizzaForm(ModelForm):
    class Meta:
        model = Pizza
        fields = ['type', 'size', 'topping']

class PizzaToppingForm(ModelForm):
    toppings = ModelChoiceField(queryset=PizzaTopping.objects.all(), widget=RadioSelect, help_text="Choose your toppings")

    class Meta:
        model = PizzaTopping
        fields = ['name']

class SubForm(ModelForm):
    class Meta:
        model = Sub
        fields = ['size']

class SubForm(ModelForm):
    class Meta:
        model = SubTopping
        fields = ['name']
