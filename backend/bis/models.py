from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.contrib.gis.db.models import *
from phonenumber_field.modelfields import PhoneNumberField

from categories.models import FinanceCategory, GrantCategory, PropagationIntendedForCategory, DietCategory, \
    CertificateCategory
from questionnaire.models import Questionnaire


class Location(Model):
    name = CharField(max_length=63)
    gps_location = PointField()


class LocationPhotos(Model):
    location = ForeignKey(Location, on_delete=CASCADE, related_name='photos')
    photo = ImageField(upload_to='location_photos')


class User(AbstractBaseUser, PermissionsMixin):
    USERNAME_FIELD = 'email'
    EMAIL_FIELD = 'email'

    first_name = CharField(max_length=63, blank=True)
    last_name = CharField(max_length=63, blank=True)
    nickname = CharField(max_length=63, blank=True)
    phone = PhoneNumberField(blank=True)
    birthday = DateField(blank=True, null=True)

    email = EmailField(unique=True)
    is_active = BooleanField(default=True)


class AdministrativeUnit(Model):
    parent = ForeignKey('AdministrativeUnit', on_delete=PROTECT, related_name='sub_units', blank=True, null=True)
    name = CharField(max_length=63)
    board_members = ManyToManyField(User, related_name='administrative_units')


class Membership(Model):
    user = ForeignKey(User, on_delete=PROTECT, related_name='memberships')
    administrative_unit = ForeignKey(AdministrativeUnit, on_delete=PROTECT, related_name='memberships')
    year = PositiveIntegerField()


class Certificate(Model):
    user = ForeignKey(User, on_delete=PROTECT, related_name='certificates')
    category = ForeignKey(CertificateCategory, on_delete=PROTECT, related_name='certificates')
    valid_till = DateField()


class Event(Model):
    # general
    name = CharField(max_length=63)
    is_canceled = BooleanField(default=False)
    start = DateTimeField()
    end = DateField()
    location = ForeignKey(Location, on_delete=PROTECT, related_name='events')
    is_internal = BooleanField(default=False)
    number_of_sub_events = PositiveIntegerField(default=1)

    # organizers
    # segment (klub, ustredi, clanek) is a User(Profile) with a specific role
    administrative_unit = ForeignKey(AdministrativeUnit, on_delete=PROTECT, related_name='events')
    main_organizer = ForeignKey(User, on_delete=PROTECT, related_name='+')
    other_organizers = ManyToManyField(User, related_name='+')

    # finance
    finance_category = ForeignKey(FinanceCategory, on_delete=PROTECT, related_name='events')
    grant_source = ForeignKey(GrantCategory, on_delete=PROTECT, related_name='events')
    grant_amount = PositiveIntegerField()
    total_event_cost = PositiveIntegerField()
    budget = FileField(upload_to='budgets')

    # propagation
    is_shown_on_web = BooleanField()
    vip_propagation = BooleanField(default=False)

    minimum_age = PositiveIntegerField()
    maximum_age = PositiveIntegerField()
    cost = PositiveIntegerField()
    intended_for = ForeignKey(PropagationIntendedForCategory, on_delete=PROTECT, related_name='events')
    # accommodation = ForeignKey to category?
    diet = ForeignKey(DietCategory, on_delete=PROTECT, related_name='events')

    invitation_text_introduction = TextField()
    invitation_text_practical_information = TextField()
    invitation_text_work_description = TextField()
    invitation_text_about_us = TextField(blank=True)
    # propagation_images as Model below

    contact_person = ForeignKey(User, on_delete=PROTECT, related_name='+')

    # registration process
    is_registration_required = BooleanField(default=True)
    is_event_full = BooleanField(default=False)
    questionnaire = OneToOneField(Questionnaire, on_delete=PROTECT, null=True, blank=True, related_name='event')
    # filled answers as part of questionary

    # after event
    total_hours_worked = PositiveIntegerField(null=True)
    comment_on_work_done = TextField(blank=True)
    has_attendance_list = BooleanField(default=True)
    participants = ManyToManyField(User, 'participated_in_events')
    number_of_participants = PositiveIntegerField(null=True)
    number_of_participants_under_26 = PositiveIntegerField(null=True)
    # photos as Model below


class EventPropagationImage(Model):
    event = ForeignKey(Event, on_delete=CASCADE, related_name='propagation_images')
    order = PositiveIntegerField()
    image = ImageField(upload_to='event_propagation_images')


class EventPhoto(Model):
    event = ForeignKey(Event, on_delete=CASCADE, related_name='photos')
    image = ImageField(upload_to='event_photos')
