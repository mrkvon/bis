from django.utils.timezone import now
from rest_framework.viewsets import ReadOnlyModelViewSet

from event.models import Event
from web_api.filters import EventFilter
from web_api.serializers import EventSerializer


class EventViewSet(ReadOnlyModelViewSet):
    queryset = Event.objects.filter(
        start__gte=now(),
        is_canceled=False,
        propagation__is_shown_on_web=True
    ).order_by('start').select_related(
        'location',
        'category',
        'program',
        'administration_unit',
        'propagation',
        'propagation__intended_for',
        'propagation__diet',
        'registration',
    ).prefetch_related(
        'propagation__images'
    )
    serializer_class = EventSerializer
    filterset_class = EventFilter
