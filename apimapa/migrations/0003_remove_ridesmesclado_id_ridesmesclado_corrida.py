# Generated by Django 4.1 on 2023-11-16 06:24

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("apimapa", "0002_corrida_alter_ridesmesclado_ride_duration"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="ridesmesclado",
            name="id",
        ),
        migrations.AddField(
            model_name="ridesmesclado",
            name="corrida",
            field=models.OneToOneField(
                default=None,
                on_delete=django.db.models.deletion.CASCADE,
                primary_key=True,
                serialize=False,
                to="apimapa.corrida",
            ),
        ),
    ]
