# Generated by Django 4.0.4 on 2022-05-31 12:46

from django.db import migrations, models
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0002_alter_vipeventpropagation_goals_of_event_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='eventpropagation',
            name='contact_email',
            field=models.EmailField(blank=True, help_text='Nechte prázdné pokud chcete použít e-mail kontaktní osoby', max_length=254),
        ),
        migrations.AddField(
            model_name='eventpropagation',
            name='contact_name',
            field=models.CharField(blank=True, help_text='Nechte prázdné pokud chcete použít jméno kontaktní osoby', max_length=63),
        ),
        migrations.AddField(
            model_name='eventpropagation',
            name='contact_phone',
            field=phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, region=None),
        ),
    ]
