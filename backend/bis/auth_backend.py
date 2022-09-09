from django.contrib.auth.backends import ModelBackend


class BISBackend(ModelBackend):
    def has_perm(self, user_obj, perm, obj=None):
        return user_obj.is_active
