# Generated by Django 5.0.6 on 2024-06-27 09:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('startups', '0002_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Industry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
            ],
        ),
    ]