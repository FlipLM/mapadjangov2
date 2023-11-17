from django import forms
from django.forms import ModelChoiceField
from apimapa.models import RidesMesclado, Estacao

class EstacaoModelChoiceField(forms.ModelChoiceField):
    def label_from_instance(self, obj):
        return obj.station

    def is_hidden(self, *args, **kwargs):
        return False

    def use_required_attribute(self, *args, **kwargs):
        return False

class RidesMescladoForm(forms.ModelForm):
    station_start = EstacaoModelChoiceField(queryset=Estacao.objects.all(), empty_label=None, to_field_name='station')
    station_end = EstacaoModelChoiceField(queryset=Estacao.objects.all(), empty_label=None, to_field_name='station')

    class Meta:
        model = RidesMesclado
        fields = '__all__'
    widgets = {
            'station_start_lat': forms.HiddenInput(),
            'station_start_lon': forms.HiddenInput(),
            'station_end_lat': forms.HiddenInput(),
            'station_end_lon': forms.HiddenInput(),
        }
