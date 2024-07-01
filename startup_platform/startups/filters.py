import django_filters
from .models import Startup

class StartupFilter(django_filters.FilterSet):
    name = django_filters.CharFilter(lookup_expr='icontains')
    industry = django_filters.CharFilter(lookup_expr='icontains')
    min_founded_date = django_filters.DateFilter(field_name='founded_date', lookup_expr='gte')
    max_founded_date = django_filters.DateFilter(field_name='founded_date', lookup_expr='lte')

    class Meta:
        model = Startup
        fields = ['name', 'industry', 'funding_stage']