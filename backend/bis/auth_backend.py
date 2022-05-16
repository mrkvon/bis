from django.contrib.auth.backends import ModelBackend

from bis.models import User


class BISBackend(ModelBackend):
    def user_can_authenticate(self, user):
        print('wtf', flush=True)
        return super().user_can_authenticate(user)

    def with_perm(self, perm, is_active=True, include_superusers=True, obj=None):
        print('wtf', flush=True)
        return super().with_perm(perm, is_active, include_superusers, obj)

    def _get_user_permissions(self, user_obj):
        print('wtf', flush=True)
        return super()._get_user_permissions(user_obj)

    def _get_group_permissions(self, user_obj):
        print('wtf', flush=True)
        return super()._get_group_permissions(user_obj)

    def _get_permissions(self, user_obj, obj, from_name):
        print('wtf', flush=True)
        return super()._get_permissions(user_obj, obj, from_name)

    def authenticate(self, request, **kwargs):
        print('wtf', flush=True)
        super().authenticate(request, **kwargs)

    def get_user_permissions(self, user_obj, obj=None):
        print('wtf', flush=True)
        return super().get_user_permissions(user_obj, obj)

    def get_group_permissions(self, user_obj, obj=None):
        print('wtf', flush=True)
        return super().get_group_permissions(user_obj, obj)

    def get_all_permissions(self, user_obj, obj=None):
        print('wtf', flush=True)
        return super().get_all_permissions(user_obj, obj)

    def get_user(self, user_id):
        print('wtf', user_id, User.objects.filter(pk=user_id).first().is_active, flush=True)
        return User.objects.filter(pk=user_id).first()

    def has_perm(self, user_obj, perm, obj=None):
        print('wtf', flush=True)
        print(user_obj, flush=True)
        return user_obj.is_active

    def has_module_perms(self, user_obj, app_label):  # todo
        print('wtf', flush=True)
        print(user_obj, flush=True)
        return user_obj.is_active
