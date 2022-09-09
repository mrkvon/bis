from rest_framework.fields import EmailField, CharField
from rest_framework.serializers import Serializer


class LoginRequestSerializer(Serializer):
    email = EmailField()
    password = CharField()


class TokenResponse(Serializer):
    token = CharField()


class SendVerificationLinkRequestSerializer(Serializer):
    email = EmailField()


class ResetPasswordRequestSerializer(Serializer):
    email = EmailField()
    code = CharField()
    password = CharField()
