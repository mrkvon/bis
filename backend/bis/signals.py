from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token

from bis.models import *
from project import settings


@receiver(post_save, sender=settings.AUTH_USER_MODEL, dispatch_uid='create_auth_token_for_all_users')
def create_auth_token_for_all_users(instance: User, **kwargs):
    Token.objects.get_or_create(user=instance)
