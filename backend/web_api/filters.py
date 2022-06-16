from django_filters import *

from categories.models import EventCategory, EventProgramCategory, PropagationIntendedForCategory, OpportunityCategory
from event.models import Event
from opportunities.models import Opportunity


class ChoiceInFilter(BaseInFilter, ChoiceFilter):
    pass


class EventFilter(FilterSet):
    category = ChoiceInFilter(
        field_name='category__slug',
        choices=[(c.slug, c.name) for c in EventCategory.objects.all()]
    )
    program = ChoiceInFilter(
        field_name='program__slug',
        choices=[(c.slug, c.name) for c in EventProgramCategory.objects.all()]
    )
    intended_for = ChoiceInFilter(
        field_name='propagation__intended_for__slug',
        choices=[(c.slug, c.name) for c in PropagationIntendedForCategory.objects.all()]
    )
    duration = NumberFilter(field_name='duration')
    duration__lte = NumberFilter(field_name='duration', lookup_expr='gte')
    duration__gte = NumberFilter(field_name='duration', lookup_expr='lte')

    class Meta:
        model = Event
        fields = []


class OpportunityFilter(FilterSet):
    category = ChoiceInFilter(
        field_name='category__slug',
        choices=[(c.slug, c.name) for c in OpportunityCategory.objects.all()]
    )

    class Meta:
        model = Opportunity
        fields = []
