from django.contrib.auth.backends import ModelBackend


# staff has by default all permissions, permissions are adjusted
# per-object per-admin
class BISBackend(ModelBackend):
    def has_perm(self, user_obj, perm, obj=None):
        return user_obj.is_active

    def has_module_perms(self, user_obj, app_label):
        return user_obj.is_active
