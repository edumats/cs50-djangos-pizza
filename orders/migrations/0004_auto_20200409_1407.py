# Generated by Django 3.0.3 on 2020-04-09 14:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0003_auto_20200403_1547'),
    ]

    operations = [
        migrations.AlterField(
            model_name='pizza',
            name='size',
            field=models.CharField(choices=[('S', 'Small'), ('L', 'Large')], default='CH', help_text='Choose your Pizza Size', max_length=1),
        ),
        migrations.AlterField(
            model_name='pizza',
            name='topping',
            field=models.CharField(choices=[('CH', 'Cheese'), ('1T', '1 Topping'), ('2T', '2 Toppings'), ('3T', '3 Toppings'), ('SP', 'Special')], default='S', help_text='How many toppings?', max_length=2),
        ),
        migrations.AlterField(
            model_name='pizza',
            name='type',
            field=models.CharField(choices=[('R', 'Regular'), ('S', 'Sicilian')], default='R', help_text='Regular or Sicilian Pizza?', max_length=1),
        ),
        migrations.AlterField(
            model_name='product',
            name='slug',
            field=models.SlugField(max_length=120, unique=True),
        ),
    ]
