from django.db.utils import ProgrammingError
from django_filters import *

from categories.models import EventCategory, EventProgramCategory, PropagationIntendedForCategory, OpportunityCategory
from event.models import Event
from opportunities.models import Opportunity


class ChoiceInFilter(BaseInFilter, ChoiceFilter):
    pass


def get_choices(model):
    try:
        return [(c.slug, c.name) for c in model.objects.all()]
    except ProgrammingError:
        return []


class EventFilter(FilterSet):
    category = ChoiceInFilter(
        field_name='category__slug',
        choices=get_choices(EventCategory)
    )
    program = ChoiceInFilter(
        field_name='program__slug',
        choices=get_choices(EventProgramCategory)
    )
    intended_for = ChoiceInFilter(
        field_name='propagation__intended_for__slug',
        choices=get_choices(PropagationIntendedForCategory)
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
        choices=get_choices(OpportunityCategory)
    )

    class Meta:
        model = Opportunity
        fields = []
