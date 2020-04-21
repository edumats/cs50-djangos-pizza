from django.forms import Form, ModelForm, ModelMultipleChoiceField, ModelChoiceField, ChoiceField, CheckboxSelectMultiple, BooleanField
from orders.models import Pizza, PizzaTopping, Sub, SubTopping

class PizzaForm(ModelForm):
    class Meta:
        model = Pizza
        fields = ['size', 'topping']

class PizzaToppingForm(Form):
    toppings = ModelMultipleChoiceField(
        queryset=PizzaTopping.objects.all(),
        widget=CheckboxSelectMultiple(),
        help_text="Choose your toppings",
        required=False,
        to_field_name="name"
        )

class SubSizeForm(ModelForm):
    class Meta:
        model = Sub
        fields = ['size']

class SubToppingForm(Form):
    sub_toppings = ModelMultipleChoiceField(
        queryset=SubTopping.objects.all(),
        # sets price of toppings to 0.50 and prevents checkbox from being checked at reload
        widget=CheckboxSelectMultiple(attrs={'data-price':'0.50', 'autocomplete': 'off'}),
        help_text='Choose your toppings',
        required=False,
        to_field_name="name"
    )
