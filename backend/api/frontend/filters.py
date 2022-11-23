from django_filters import *

from bis.models import User, Location
from event.models import Event


class NumberInFilter(BaseInFilter, NumberFilter):
    pass


class UUIDInFilter(BaseInFilter, UUIDFilter):
    pass


class UserFilter(FilterSet):
    id = UUIDInFilter()
    _search_id = UUIDInFilter()

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
