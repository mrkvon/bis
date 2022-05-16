from django.db.models.signals import post_save
from django.dispatch import receiver

from administration_units.models import AdministrationUnit


@receiver(post_save, sender=AdministrationUnit, dispatch_uid='set_board_members')
def set_board_members(instance, **kwargs):
    if instance.chairman: instance.board_members.add(instance.chairman)
    if instance.manager: instance.board_members.add(instance.manager)
