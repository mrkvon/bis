from django.db.models.signals import post_save, pre_save
from django.dispatch import receiver

from event.models import Event, EventPropagation


@receiver(post_save, sender=Event, dispatch_uid='add_main_organizer_as_organizer')
def add_main_organizer_as_organizer(instance: Event, **kwargs):
    if instance.main_organizer: instance.other_organizers.add(instance.main_organizer)


@receiver(post_save, sender=EventPropagation, dispatch_uid='add_contact_person_as_organizer')
def add_contact_person_as_organizer(instance: EventPropagation, **kwargs):
    if instance.contact_person: instance.event.other_organizers.add(instance.contact_person)


@receiver(pre_save, sender=Event, dispatch_uid='compute_duration_of_event')
def compute_duration_of_event(instance: Event, **kwargs):
    new_value = max((instance.end - instance.start.date()).days + 1, 0)
    if instance.duration != new_value:
        instance.duration = new_value
