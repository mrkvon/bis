# Generated by Django 4.0.3 on 2022-03-09 16:53

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('bis', '0007_rename_certificate_qualification'),
    ]

    operations = [
        migrations.RenameField(
            model_name='eventphoto',
            old_name='image',
            new_name='photo',
        ),
    ]
