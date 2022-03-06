# import base64
# import threading
#
# from rest_framework import serializers
# from rest_framework.serializers import Serializer
#
from django.contrib.auth.models import User
from phonenumbers.phonenumberutil import format_number, PhoneNumberFormat
from rest_framework.fields import SerializerMethodField, EmailField, CharField
from rest_framework.relations import PrimaryKeyRelatedField

