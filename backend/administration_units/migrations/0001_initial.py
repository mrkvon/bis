# Generated by Django 3.2.16 on 2022-11-23 06:45

from django.db import migrations, models
import django.db.models.deletion
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='AdministrationUnit',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('abbreviation', models.CharField(max_length=63, unique=True)),
                ('is_for_kids', models.BooleanField()),
                ('phone', phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None)),
                ('email', models.EmailField(max_length=254)),
                ('www', models.URLField(blank=True)),
                ('facebook', models.URLField(blank=True)),
                ('instagram', models.URLField(blank=True)),
                ('ic', models.CharField(blank=True, max_length=15)),
                ('bank_account_number', models.CharField(blank=True, max_length=63)),
                ('data_box', models.CharField(blank=True, max_length=63)),
                ('custom_statues', models.FileField(blank=True, upload_to='custom_statues')),
                ('existed_since', models.DateField(null=True)),
                ('existed_till', models.DateField(blank=True, null=True)),
                ('_import_id', models.CharField(default='', max_length=15)),
                ('_history', models.JSONField(default=dict)),
            ],
            options={
                'ordering': ('abbreviation',),
            },
        ),
        migrations.CreateModel(
            name='AdministrationUnitAddress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('street', models.CharField(max_length=127)),
                ('city', models.CharField(max_length=63)),
                ('zip_code', models.CharField(max_length=5)),
            ],
            options={
                'ordering': ('id',),
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='AdministrationUnitContactAddress',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('street', models.CharField(max_length=127)),
                ('city', models.CharField(max_length=63)),
                ('zip_code', models.CharField(max_length=5)),
            ],
            options={
                'ordering': ('id',),
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='BrontosaurusMovement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('_history', models.JSONField(default=dict)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='GeneralMeeting',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('date', models.DateField()),
                ('place', models.CharField(max_length=63)),
                ('administration_unit', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='general_meetings', to='administration_units.administrationunit')),
            ],
            options={
                'ordering': ('date',),
            },
        ),
    ]
