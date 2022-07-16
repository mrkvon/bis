from django.db.models import *

from translation.translate import translate_model


@translate_model
class GrantCategory(Model):
    name = CharField(max_length=63)
    slug = SlugField(unique=True)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class PropagationIntendedForCategory(Model):
    name = CharField(max_length=63)
    slug = SlugField(unique=True)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class DietCategory(Model):
    name = CharField(max_length=63)
    slug = SlugField(unique=True)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class QualificationCategory(Model):
    name = CharField(max_length=63)
    slug = SlugField(unique=True)
    parent = ForeignKey('QualificationCategory', on_delete=CASCADE, related_name='included_qualifications', blank=True,
                        null=True)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.slug


@translate_model
class AdministrationUnitCategory(Model):
    name = CharField(max_length=63)
    slug = SlugField(unique=True)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class MembershipCategory(Model):
    name = CharField(max_length=63)
    slug = SlugField(unique=True)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class EventCategory(Model):
    name = CharField(max_length=63)
    slug = SlugField(unique=True)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class EventProgramCategory(Model):
    name = CharField(max_length=63)
    slug = SlugField(unique=True)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class DonationSourceCategory(Model):
    name = CharField(max_length=63)
    slug = SlugField(unique=True)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class OrganizerRoleCategory(Model):
    name = CharField(max_length=63)
    slug = SlugField(unique=True)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class TeamRoleCategory(Model):
    name = CharField(max_length=63)
    slug = SlugField(unique=True)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class OpportunityCategory(Model):
    name = CharField(max_length=63)
    description = CharField(max_length=255)
    slug = SlugField(unique=True)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class LocationProgram(Model):
    name = CharField(max_length=63)
    slug = SlugField(unique=True)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class LocationAccessibility(Model):
    name = CharField(max_length=63)
    slug = SlugField(unique=True)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name
