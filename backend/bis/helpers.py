from datetime import timedelta
from time import time

from django.apps import apps
from django.conf import settings
from django.core.cache import cache
from django.utils.safestring import mark_safe
from django.utils.text import slugify


def record_history(history: dict, date, user, position):
    if not user: return
    user_id = str(user.id)
    date_ranges = history.setdefault(position, {}).setdefault(user_id, [])
    for range in date_ranges:
        if range[1] == str(date - timedelta(days=1)):
            range[1] = str(date)
            break
    else:
        date_ranges.append([str(date), str(date)])


def show_history(history: dict):
    result = []
    user_map = {}
    User = apps.get_model('bis', 'User')
    for position, position_data in history.items():
        for user_id, user_data in position_data.items():
            if user_id not in user_map:
                user_map[user_id] = User.objects.get(id=user_id)
            user = user_map[user_id]

            for range in user_data:
                result.append([position, user, range])

    result.sort(key=lambda x: x[2][1], reverse=True)

    rows = ''.join([f'<tr><td>{row[0]}</td><td>{row[1]}</td><td>{row[2][0]} - {row[2][1]}</td></tr>' for row in result])

    return mark_safe(f'<table>{rows}</table>')


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
