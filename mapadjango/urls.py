from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from mapadjango.views import EstacaoViewSet, mapa, rotas, RidesMescladoViewSet, criar_corrida, get_station_coordinates
from .views import RidesMescladoDetailView

router = DefaultRouter()
router.register(r'estacoes', EstacaoViewSet)
router.register(r'rides', RidesMescladoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('rotas/', rotas, name='rotas'),
    path('api/rides_mesclado/', RidesMescladoViewSet.as_view({'get': 'list'}), name='rides_mesclado_list'),
    path('api/rides_mesclado/<int:pk>/', RidesMescladoViewSet.as_view({'get': 'retrieve'}),
         name='rides_mesclado_detail'),
    path('api/', include(router.urls)),
    path('mapa/', mapa, name='mapa'),
    path('', mapa),
    path('criar_corrida/', criar_corrida, name='criar_corrida'),
    path('api/get_station_coordinates/<str:station_name>/', get_station_coordinates, name='get_station_coordinates'),
]
