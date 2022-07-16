# Generated by Django 3.2.14 on 2022-07-16 16:56

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('other', '0006_alter_region_options'),
        ('bis', '0021_location_region'),
    ]

    operations = [
        migrations.AlterField(
            model_name='location',
            name='region',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='locations', to='other.region'),
        ),
    ]
