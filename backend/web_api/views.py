from django.utils.timezone import now
from rest_framework.viewsets import ReadOnlyModelViewSet

from event.models import Event
from opportunities.models import Opportunity
from web_api.filters import EventFilter, OpportunityFilter
from web_api.serializers import EventSerializer, OpportunitySerializer


class EventViewSet(ReadOnlyModelViewSet):
    serializer_class = EventSerializer
    filterset_class = EventFilter

    def get_queryset(self):
        queryset = Event.objects.filter(
            start__gte=now()
        ).exclude(
            propagation__isnull=True
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

        if self.action == 'list':
            queryset = queryset.filter(
                is_canceled=False,
                propagation__is_shown_on_web=True
            )

        return queryset


class OpportunityViewSet(ReadOnlyModelViewSet):
    queryset = Opportunity.objects.filter(
        on_web_start__lte=now(),
        on_web_end__gte=now(),
    ).order_by('start').select_related(
        'category',
        'location',
        'contact_person',
    ).prefetch_related(
        'contact_person__emails'
    )
    serializer_class = OpportunitySerializer
    filterset_class = OpportunityFilter
