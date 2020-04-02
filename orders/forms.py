from django.forms import ModelForm, RadioSelect, ModelChoiceField, Form, CheckboxSelectMultiple
from orders.models import Pizza, PizzaTopping, Sub, SubTopping

class PizzaForm(ModelForm):
    class Meta:
        model = Pizza
        fields = ['type', 'size', 'topping']

class PizzaToppingForm(Form):
    toppings = ModelChoiceField(queryset=PizzaTopping.objects.all(), widget=CheckboxSelectMultiple, help_text="Choose your toppings")

class SubForm(ModelForm):
    class Meta:
        model = Sub
        fields = ['size']

class SubToppingForm(Form):
    toppings = ModelChoiceField(queryset=SubTopping.objects.all(), widget=CheckboxSelectMultiple, help_text="Choose your toppings")
