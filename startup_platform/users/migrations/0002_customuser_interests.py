# Generated by Django 5.0.6 on 2024-06-27 09:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('startups', '0003_industry'),
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='customuser',
            name='interests',
            field=models.ManyToManyField(blank=True, to='startups.industry'),
        ),
    ]