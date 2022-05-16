from datetime import timedelta
from random import randint

from django.db import models
from django.utils.timezone import now
from rest_framework.exceptions import Throttled, AuthenticationFailed

from bis.models import User


def get_code():
    return "".join([str(randint(0, 9)) for i in range(4)])


def one_hour_later():
    return now() + timedelta(hours=1)


class ThrottleLog(models.Model):
    key = models.CharField(max_length=255)
    created = models.DateTimeField(auto_now=True)


class LoginCode(models.Model):
    code = models.CharField(max_length=4, default=get_code)
    valid_till = models.DateTimeField(default=one_hour_later)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='login_codes')

    @classmethod
    def check_throttled(cls, user):
        if ThrottleLog.objects \
                .filter(key=user.email, created__gte=now() - timedelta(hours=1)) \
                .count() > 10:
            raise Throttled(3600)

        ThrottleLog.objects.create(key=user.email)

    @classmethod
    def make(cls, user):
        cls.check_throttled(user)
        return cls.objects.create(user=user)

    @classmethod
    def is_valid(cls, user, code, raise_exception=True):
        cls.check_throttled(user)

        code = str(code)
        while len(code) < 4:
            code = "0" + code

        login_code = cls.objects.filter(user=user, code=code, valid_till__gte=now()).first()

        if login_code is None and raise_exception:
            raise AuthenticationFailed()

        return login_code is not None
