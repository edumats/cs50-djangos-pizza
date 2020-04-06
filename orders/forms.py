from django.forms import Form, ModelForm, ModelMultipleChoiceField, ModelChoiceField, CheckboxSelectMultiple, BooleanField
from orders.models import Pizza, PizzaTopping, Sub, SubTopping

class PizzaForm(ModelForm):
    class Meta:
        model = Pizza
        fields = ['type', 'size', 'topping']
        widget = {
            'type': BooleanField()
        }

class PizzaToppingForm(Form):
    name = ModelMultipleChoiceField(
        queryset=PizzaTopping.objects.all(),
        widget=CheckboxSelectMultiple(),
        help_text="Choose your toppings",
        required=False,
        to_field_name="name"
        )

class SubForm(ModelForm):
    class Meta:
        model = Sub
        fields = ['size']

class SubToppingForm(Form):
    toppings = ModelMultipleChoiceField(
        queryset=SubTopping.objects.all(),
        widget=CheckboxSelectMultiple(),
        help_text="Choose your toppings",
        required=False,
        to_field_name="name"
    )
