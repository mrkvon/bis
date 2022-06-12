# Generated by Django 4.0.5 on 2022-06-12 10:37

from django.db import migrations
import tinymce.models


class Migration(migrations.Migration):

    dependencies = [
        ('event', '0006_alter_eventpropagation_invitation_text_introduction'),
    ]

    operations = [
        migrations.AlterField(
            model_name='eventpropagation',
            name='invitation_text_about_us',
            field=tinymce.models.HTMLField(blank=True),
        ),
        migrations.AlterField(
            model_name='eventpropagation',
            name='invitation_text_practical_information',
            field=tinymce.models.HTMLField(),
        ),
        migrations.AlterField(
            model_name='eventpropagation',
            name='invitation_text_work_description',
            field=tinymce.models.HTMLField(),
        ),
    ]
