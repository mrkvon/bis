# Generated by Django 3.2.15 on 2022-08-24 11:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('categories', '0010_sexcategory'),
        ('opportunities', '0007_alter_opportunity_image'),
    ]

    operations = [
        migrations.AlterField(
            model_name='offeredhelp',
            name='programs',
            field=models.ManyToManyField(blank=True, limit_choices_to=models.Q(('slug', 'none'), _negated=True), related_name='offered_help', to='categories.EventProgramCategory'),
        ),
    ]
