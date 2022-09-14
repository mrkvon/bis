from django_filters import *

from bis.models import User, Location
from event.models import Event


class NumberInFilter(BaseInFilter, NumberFilter):
    pass


class UserFilter(FilterSet):
    id = NumberInFilter()

    class Meta:
        model = User
        fields = []


class EventFilter(FilterSet):
    id = NumberInFilter()

    class Meta:
        model = Event
        fields = []


class LocationFilter(FilterSet):
    id = NumberInFilter()

    class Meta:
        model = Location
        fields = []
