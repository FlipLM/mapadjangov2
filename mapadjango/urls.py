from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from mapadjango.views import EstacaoViewSet, mapa, rotas
from .views import RidesMescladoDetailView


router = DefaultRouter()
router.register(r'estacoes', EstacaoViewSet)


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('rotas/', rotas, name='rotas'),
    path('', mapa),
    path('api/rides_mesclado/<int:pk>/', RidesMescladoDetailView.as_view(), name='rides_mesclado_detail'),
    path('rides_mesclado/<int:pk>/', RidesMescladoDetailView.as_view(), name='rides_mesclado-detail'),
    path('api/', include(router.urls)),
]
