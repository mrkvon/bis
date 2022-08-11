# Generated by Django 3.2.15 on 2022-08-11 15:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('regions', '0002_alter_zipcode_region'),
        ('categories', '0009_alter_healthinsurancecompany_name'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('administration_units', '0017_alter_administrationunit_board_members'),
    ]

    operations = [
        migrations.AlterField(
            model_name='administrationunit',
            name='category',
            field=models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='administration_units', to='categories.administrationunitcategory'),
        ),
        migrations.AlterField(
            model_name='administrationunit',
            name='chairman',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='chairman_of', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='administrationunit',
            name='manager',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.PROTECT, related_name='manager_of', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='administrationunit',
            name='vice_chairman',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='vice_chairman_of', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='administrationunitaddress',
            name='region',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='+', to='regions.region'),
        ),
        migrations.AlterField(
            model_name='administrationunitcontactaddress',
            name='region',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='+', to='regions.region'),
        ),
        migrations.AlterField(
            model_name='brontosaurusmovement',
            name='director',
            field=models.ForeignKey(help_text='Má veškerá oprávnění', on_delete=django.db.models.deletion.PROTECT, related_name='director_of', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AlterField(
            model_name='brontosaurusmovement',
            name='finance_director',
            field=models.ForeignKey(help_text='Má veškerá oprávnění', on_delete=django.db.models.deletion.PROTECT, related_name='finance_director_of', to=settings.AUTH_USER_MODEL),
        ),
    ]
