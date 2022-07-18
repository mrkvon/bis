from django.conf import settings
from django.core.management.base import BaseCommand
from django.db.models.signals import post_save
from django.utils.datetime_safe import date

from bis.models import User


class Command(BaseCommand):
    def handle(self, *args, **options):
        post_save.disconnect(sender=settings.AUTH_USER_MODEL, dispatch_uid='set_unique_str')

        for user in User.objects.all().prefetch_related('memberships', 'qualifications', 'events_where_was_organizer',
                                                        'participated_in_events__event'):
            dates = [user.date_joined]

            for membership in user.memberships.all():
                dates.append(date(membership.year, 1, 1))

            for qualification in user.qualifications.all():
                dates.append(qualification.valid_since)

            for event in user.events_where_was_organizer.all():
                dates.append(event.start.date())

            for event in user.participated_in_events.all():
                dates.append(event.event.start.date())

            dates.sort()
            if user.date_joined != dates[0]:
                print(user.date_joined, dates[0])
                user.date_joined = dates[0]
                user.save()
