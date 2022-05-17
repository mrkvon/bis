from django.db.models.signals import post_save
from django.dispatch import receiver
from event.models import Event


@receiver(post_save, sender=Event, dispatch_uid='add_main_organizer_as_organizer')
def add_main_organizer_as_organizer(instance: Event, **kwargs):
    if instance.main_organizer: instance.other_organizers.add(instance.main_organizer)
