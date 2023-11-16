from rest_framework import serializers
from apimapa.models import Estacao
from .models import RidesMesclado


class RidesMescladoSerializer(serializers.ModelSerializer):
    class Meta:
        model = RidesMesclado
        fields = '__all__'

    def get_formatted_duration(self, obj):
        return obj.formatted_duration()


class EstacaoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Estacao
        fields = ['station', 'station_number', 'station_name', 'lat', 'lon']
