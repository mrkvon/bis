# Generated by Django 3.2.16 on 2022-12-31 11:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bis', '0004_rename_is_completed_event_is_complete'),
    ]

    operations = [
        migrations.AlterField(
            model_name='qualification',
            name='valid_till',
            field=models.DateField(editable=False),
        ),
    ]
