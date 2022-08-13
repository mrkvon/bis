from time import time

from django.conf import settings
from django.core.cache import cache
from django.utils.text import slugify


def print_progress(name, i, total):
    key = f'progress_of_{slugify(name)}'

    if i >= total - 1:
        cache.set(key, None)
        return

    obj = cache.get(key)
    if not obj:
        print(name)
        cache.set(key, time())

    elif time() - obj >= 1:
        print(f"{name}, progress {100 * i / total:.2f}%")
        cache.set(key, time())


def cache_into_self(name):
    name = f"__cache__{name}"

    def decorator(f):
        def wrapper(self, *args, **kwargs):
            if hasattr(self, name):
                return getattr(self, name)

            result = f(self, *args, **kwargs)

            setattr(self, name, result)

            return result

        return wrapper

    return decorator


def permission_cache(f):
    return cache_into_self('permission_cache')(f)


def update_roles(*roles):
    def decorator(f):
        def wrapper(self, *args, **kwargs):

            to_update = set()
            old = self._meta.model.objects.filter(id=self.id).first()
            if old:
                for role in roles:
                    to_update.add(getattr(old, role))

            f(self, *args, **kwargs)

            for role in roles:
                to_update.add(getattr(self, role))

            for user in to_update:
                if user:
                    user.update_roles()

        return wrapper

    return decorator


class paused_validation:
    def __enter__(self):
        assert not settings.SKIP_VALIDATION
        settings.SKIP_VALIDATION = True

    def __exit__(self, exc_type, exc_val, exc_tb):
        settings.SKIP_VALIDATION = False


def with_paused_validation(f):
    def wrapper(*args, **kwargs):
        with paused_validation():
            return f(*args, **kwargs)

    return wrapper
