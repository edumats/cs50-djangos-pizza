# Generated by Django 3.0.2 on 2020-01-23 18:03

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('orders', '0004_dinner_price'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='sub',
            name='name',
        ),
    ]
