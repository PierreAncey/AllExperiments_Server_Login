# Generated by Django 4.2.4 on 2024-02-03 22:50

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rest', '0009_experiment_token_alter_experiment_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='unitydata',
            name='timestamp',
            field=models.DateTimeField(default=datetime.datetime(2024, 2, 3, 21, 50, 21, 810195, tzinfo=datetime.timezone.utc), help_text='Timestamp of when the data was recorded'),
        ),
    ]
