from django.db.models import *


class FinanceCategory(Model):
    name = CharField(max_length=63)


class GrantCategory(Model):
    name = CharField(max_length=63)


class PropagationIntendedForCategory(Model):
    name = CharField(max_length=63)


class DietCategory(Model):
    name = CharField(max_length=63)


class CertificateCategory(Model):
    name = CharField(max_length=63)