from django.db import models




class CustomDurationField(models.DurationField):
    def to_representation(self, value):
        # Converte a duração para segundos
        return int(value.total_seconds())

class Estacao(models.Model):
    station = models.CharField(max_length=200, primary_key=True)
    station_number = models.IntegerField()
    station_name = models.CharField(max_length=200)
    lat = models.FloatField()
    lon = models.FloatField()

    class Meta:
        db_table = 'df_stations'

class RidesMesclado(models.Model):
    id = models.AutoField(primary_key=True)
    user_gender = models.CharField(max_length=10)
    user_birthdate = models.DateField()
    user_residence = models.CharField(max_length=255)
    ride_date = models.DateField()
    time_start = models.TimeField()
    time_end = models.TimeField()
    station_start = models.CharField(max_length=255)
    station_end = models.CharField(max_length=255)
    ride_duration = models.FloatField()
    ride_late = models.BooleanField()
    station_start_lat = models.FloatField()
    station_start_lon = models.FloatField()
    station_end_lat = models.FloatField()
    station_end_lon = models.FloatField()

    class Meta:
        db_table = 'rides_mesclado'