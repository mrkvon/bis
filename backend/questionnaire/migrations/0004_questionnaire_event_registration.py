# Generated by Django 4.0.3 on 2022-03-10 11:23

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0007_remove_eventregistration_questionnaire'),
        ('questionnaire', '0003_alter_answer_options'),
    ]

    operations = [
        migrations.AddField(
            model_name='questionnaire',
            name='event_registration',
            field=models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.PROTECT, related_name='questionnaire', to='event.eventregistration'),
        ),
    ]
