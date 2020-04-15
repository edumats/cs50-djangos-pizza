from django.forms import Form, ModelForm, ModelMultipleChoiceField, ModelChoiceField, ChoiceField, CheckboxSelectMultiple, BooleanField
from orders.models import Pizza, PizzaTopping, Sub, SubTopping

class PizzaForm(ModelForm):
    class Meta:
        model = Pizza
        fields = ['type', 'size', 'topping']

class PizzaToppingForm(Form):
    toppings = ModelMultipleChoiceField(
        queryset=PizzaTopping.objects.all(),
        widget=CheckboxSelectMultiple(),
        help_text="Choose your toppings",
        required=False,
        to_field_name="name"
        )


class SubForm(Form):
    type = ModelChoiceField(
        queryset=Sub.objects.order_by().values('name').distinct(),
        empty_label=None,
        help_text="Choose your Sub",
        required=False,
        to_field_name="name"
    )

class SubSizeForm(ModelForm):
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
