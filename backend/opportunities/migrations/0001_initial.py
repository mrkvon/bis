# Generated by Django 3.2.16 on 2022-11-23 06:45

import common.thumbnails
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import phonenumber_field.modelfields
import tinymce.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('categories', '0001_initial'),
        ('bis', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Opportunity',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=63)),
                ('start', models.DateField()),
                ('end', models.DateField()),
                ('on_web_start', models.DateField()),
                ('on_web_end', models.DateField()),
                ('introduction', tinymce.models.HTMLField(help_text='Krátce vysvětli význam činnosti a její přínos, aby přilákala zájemce')),
                ('description', tinymce.models.HTMLField(help_text='Přibliž konkrétní činnosti a aktivity, které budou součástí příležitosti')),
                ('location_benefits', tinymce.models.HTMLField(blank=True, help_text='Popiš dopad a přínos činnosti pro dané místě (nezobrazí se u typu spolupráce)')),
                ('personal_benefits', tinymce.models.HTMLField(help_text='Uveď konkrétní osobní přínos do života z realizace této příležitosti')),
                ('requirements', tinymce.models.HTMLField(help_text='Napiš dovednosti, zkušenosti či vybavení potřebné k zapojení do příležitosti')),
                ('contact_name', models.CharField(blank=True, help_text='Nechte prázdné pokud chcete použít jméno kontaktní osoby', max_length=63)),
                ('contact_phone', phonenumber_field.modelfields.PhoneNumberField(blank=True, help_text='Nechte prázdné pokud chcete použít telefon kontaktní osoby', max_length=128, region=None)),
                ('contact_email', models.EmailField(blank=True, help_text='Nechte prázdné pokud chcete použít e-mail kontaktní osoby', max_length=254)),
                ('image', common.thumbnails.ThumbnailImageField(upload_to='opportunity_images')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='opportunities', to='categories.opportunitycategory')),
                ('contact_person', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='opportunities', to=settings.AUTH_USER_MODEL)),
                ('location', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='opportunities', to='bis.location')),
            ],
            options={
                'ordering': ('id',),
            },
        ),
        migrations.CreateModel(
            name='OfferedHelp',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('additional_organizer_role', models.CharField(blank=True, max_length=63)),
                ('additional_team_role', models.CharField(blank=True, max_length=63)),
                ('info', models.TextField(blank=True)),
                ('organizer_roles', models.ManyToManyField(blank=True, related_name='offered_help', to='categories.OrganizerRoleCategory')),
                ('programs', models.ManyToManyField(blank=True, limit_choices_to=models.Q(('slug', 'none'), _negated=True), related_name='offered_help', to='categories.EventProgramCategory')),
                ('team_roles', models.ManyToManyField(blank=True, related_name='offered_help', to='categories.TeamRoleCategory')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='offers', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ('id',),
            },
        ),
    ]
