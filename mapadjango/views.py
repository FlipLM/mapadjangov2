from rest_framework import viewsets
from rest_framework.exceptions import APIException
from rest_framework.pagination import PageNumberPagination
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
from django.shortcuts import render, redirect
from .forms import RidesMescladoForm
from django.http import JsonResponse

def get_station_coordinates(request, station_name):
    try:
        station = Estacao.objects.get(station_name=station_name)
        coordinates = {'lat': station.lat, 'lon': station.lon}
        return JsonResponse(coordinates)
    except Estacao.DoesNotExist:
        return JsonResponse({'error': 'Estação não encontrada'}, status=404)


def criar_corrida(request):
    if request.method == 'POST':
        form = RidesMescladoForm(request.POST)
        if form.is_valid():
            nova_corrida = form.save()
            nova_corrida.save()

            station_start = request.POST.get('station_start')
            selected_station = Estacao.objects.filter(station_name=station_start).first()

            if selected_station:
                coordinates = {
                    'lat': selected_station.lat,
                    'lon': selected_station.lon,
                }
                # Retorne a resposta JSON com as coordenadas e o ID da corrida
                return JsonResponse({'success': True, 'corrida_id': nova_corrida.id, 'redirect_to_rotas': True})

            # Redirecionar para a página 'rotas' após a criação bem-sucedida da corrida
            return JsonResponse({'success': True, 'corrida_id': nova_corrida.id, 'redirect_to_rotas': True})

    else:
        form = RidesMescladoForm()

    return render(request, 'criar_corrida.html', {'form': form})
class RidesMescladoViewSet(viewsets.ModelViewSet):
    queryset = RidesMesclado.objects.all()
    serializer_class = RidesMescladoSerializer
    pagination_class = PageNumberPagination


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
