from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

from bis.models import *
from regions.models import Region
from project import settings


@receiver(post_save, sender=settings.AUTH_USER_MODEL, dispatch_uid='create_auth_token_for_all_users')
def create_auth_token_for_all_users(instance: User, created, **kwargs):
    if created:
        Token.objects.get_or_create(user=instance)


@receiver(post_save, sender=settings.AUTH_USER_MODEL, dispatch_uid='set_unique_str')
def set_unique_str(instance: User, **kwargs):
    data = {'': list(User.objects.all())}
    new_data = {}

    f1 = lambda user: user.get_name()

    def f2(user):
        name = user.get_name()
        if user.age is not None: name += f' ({user.age})'
        return name

    for f in [f1, f2]:
        for key, value in data.items():
            if len(value) > 1:
                for user in value:
                    new_data.setdefault(f(user), []).append(user)

            else:
                new_data[key] = value

        new_data, data = data, new_data
        new_data.clear()

    to_update = []
    for key, value in data.items():
        for user in value:
            if user._str != key:
                user._str = key
                to_update.append(user)

    if to_update:
        User.objects.bulk_update(to_update, ['_str'], batch_size=100)


@receiver(post_save, sender=Location, dispatch_uid='set_region_for_location')
def set_region_for_location(instance: Location, created, **kwargs):
    if instance.gps_location:
        region = Region.objects.filter(area__contains=instance.gps_location).first()
        if region != instance.region:
            instance.region = region
            instance.save()



