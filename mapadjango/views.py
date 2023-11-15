from rest_framework import viewsets
from rest_framework.exceptions import APIException
from rest_framework.response import Response
from rest_framework import status
from apimapa.models import Estacao
from apimapa.serializers import EstacaoSerializer
from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.http import JsonResponse
from django.views import View
from apimapa.models import RidesMesclado
from apimapa.serializers import RidesMescladoSerializer

class RidesMescladoViewSet(viewsets.ModelViewSet):
    queryset = RidesMesclado.objects.all()
    serializer_class = RidesMescladoSerializer
class RidesMescladoDetailView(View):
    def get(self, request, pk):
        ride = get_object_or_404(RidesMesclado, pk=pk)
        data = {
            'id': ride.id,
            'user_gender': ride.user_gender,
            'user_birthdate': ride.user_birthdate,
            'user_residence': ride.user_residence,
            'ride_date': ride.ride_date,
            'time_start': ride.time_start,
            'time_end': ride.time_end,
            'station_start': ride.station_start,
            'station_end': ride.station_end,
            'ride_duration': ride.ride_duration.total_seconds(),
            'ride_late': ride.ride_late,
            'station_start_lat': ride.station_start_lat,
            'station_start_lon': ride.station_start_lon,
            'station_end_lat': ride.station_end_lat,
            'station_end_lon': ride.station_end_lon,
        }
        return JsonResponse(data)
def rotas(request):
    # Recupere todos os dados de corrida da tabela rides_mesclado
    corridas = RidesMesclado.objects.all()
    return render(request, 'rotas.html', {'corridas': corridas})
def mapa(request):
    return render(request, 'mapa.html')

class EstacaoViewSet(viewsets.ModelViewSet):
    queryset = Estacao.objects.all()
    serializer_class = EstacaoSerializer

    def create(self, request, *args, **kwargs):
        try:
            serializer = self.get_serializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        except APIException as e:
            print(f'Error in create method: {str(e)}')
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()


        new_station = request.data.get('station', instance.station)
        if new_station != instance.station:
            return Response({'error': 'Não é permitido alterar o campo "station".'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(instance, data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)


