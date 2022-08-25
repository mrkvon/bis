from django import template
from django.utils.datetime_safe import date
from django.utils.safestring import mark_safe
from django.utils.timezone import now

from bis.admin_filters import EventStatsDateFilter, UserStatsDateFilter
from bis.helpers import AgeStats
from bis.models import User
from event.models import Event

register = template.Library()


@register.simple_tag(takes_context=True)
def user_stats(context, changelist):
    queryset = changelist.queryset
    age_stats = []
    to_date = date(now().year, 1, 1)
    if queryset.model is User:
        selected_date = getattr(context['request'], UserStatsDateFilter.cache_name, None)
        if selected_date:
            to_date = selected_date['close_person__birthday'].date()

        age_stats.append(AgeStats('lidí', queryset, to_date))

    event_stats_date = getattr(context['request'], EventStatsDateFilter.cache_name, None)
    if queryset.model is Event and event_stats_date:
        to_date = event_stats_date['main_organizer__birthday'].date()
        user_queryset = User.objects.filter(participated_in_events__event__in=queryset)
        age_stats.append(AgeStats('účastí na akci', user_queryset, to_date))
        user_queryset = user_queryset.distinct()
        age_stats.append(AgeStats('unikátních účastí na akci', user_queryset, to_date))

        user_queryset = User.objects.filter(events_where_was_organizer__in=queryset)
        age_stats.append(AgeStats('zorganizování akce', user_queryset, to_date))
        user_queryset = user_queryset.distinct()
        age_stats.append(AgeStats('unikátních zorganizování akce', user_queryset, to_date))

    return mark_safe(''.join([stat.as_table() for stat in age_stats]))
