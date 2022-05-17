from django.contrib.auth.backends import BaseBackend

from bis.models import User


class BISBackend(BaseBackend):
    def get_user(self, user_id):
        return User.objects.filter(pk=user_id).first()

    def has_perm(self, user_obj, perm, obj=None):
        return user_obj.is_active
