from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from event.models import Event


@receiver(post_save, sender=Event, dispatch_uid='add_main_organizer_as_organizer')
def add_main_organizer_as_organizer(instance: Event, **kwargs):
    if instance.main_organizer: instance.other_organizers.add(instance.main_organizer)


@receiver(pre_save, sender=Event, dispatch_uid='compute_duration_of_event')
def compute_duration_of_event(instance: Event, **kwargs):
    instance.duration = max((instance.end - instance.start.date()).days + 1, 0)
