from os.path import basename

from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, UserManager
from django.contrib.gis.db.models import *
from django.utils import timezone
from django.utils.safestring import mark_safe
from phonenumber_field.modelfields import PhoneNumberField

from categories.models import FinanceCategory, GrantCategory, PropagationIntendedForCategory, DietCategory, \
    QualificationCategory
from questionnaire.models import Questionnaire
from translation.translate import translate_model


@translate_model
class Location(Model):
    name = CharField(max_length=63)
    gps_location = PointField()

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class LocationPhoto(Model):
    location = ForeignKey(Location, on_delete=CASCADE, related_name='photos')
    photo = ImageField(upload_to='location_photos')

    def photo_tag(self):
        return mark_safe(f'<img style="max-height: 10rem; max-width: 20rem" src="{self.photo.url}" />')

    photo_tag.short_description = 'Náhled'

    class Meta:
        ordering = 'id',

    def __str__(self):
        return basename(self.photo.name)


@translate_model
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
    date_joined = DateTimeField(default=timezone.now)

    objects = UserManager()

    @property
    def is_staff(self):
        return self.is_superuser or AdministrativeUnit.objects.filter(board_members=self).exists()

    def has_usable_password(self):
        return False

    class Meta:
        ordering = 'id',

    def __str__(self):
        name = f'{self.first_name} {self.last_name}'
        if self.nickname:
            name = f'{self.nickname} ({name})'

        if len(name) == 1:
            return self.email

        return name


@translate_model
class AdministrativeUnit(Model):
    parent = ForeignKey('AdministrativeUnit', on_delete=PROTECT, related_name='sub_units', blank=True, null=True)
    name = CharField(max_length=63)
    board_members = ManyToManyField(User, related_name='administrative_units')

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class Membership(Model):
    user = ForeignKey(User, on_delete=PROTECT, related_name='memberships')
    administrative_unit = ForeignKey(AdministrativeUnit, on_delete=PROTECT, related_name='memberships')
    year = PositiveIntegerField()

    class Meta:
        ordering = 'id',

    def __str__(self):
        return f'Členství uživatele {self.user}'


@translate_model
class Qualification(Model):
    user = OneToOneField(User, on_delete=PROTECT, related_name='qualifications')
    category = ForeignKey(QualificationCategory, on_delete=PROTECT, related_name='qualifications')
    valid_till = DateField()

    class Meta:
        ordering = 'id',

    def __str__(self):
        return f'Kvalifikace uživatele {self.user}'


@translate_model
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
    other_organizers = ManyToManyField(User, related_name='+', blank=True)

    # finance
    finance_category = ForeignKey(FinanceCategory, on_delete=PROTECT, related_name='events' )
    grant_source = ForeignKey(GrantCategory, on_delete=PROTECT, related_name='events', null=True, blank=True)
    grant_amount = PositiveIntegerField(null=True, blank=True)
    total_event_cost = PositiveIntegerField(null=True, blank=True)
    budget = FileField(upload_to='budgets', blank=True)

    # propagation
    is_shown_on_web = BooleanField()
    vip_propagation = BooleanField(default=False)

    minimum_age = PositiveIntegerField(null=True, blank=True)
    maximum_age = PositiveIntegerField(null=True, blank=True)
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
    total_hours_worked = PositiveIntegerField(null=True, blank=True)
    comment_on_work_done = TextField(blank=True)
    has_attendance_list = BooleanField(default=True)
    participants = ManyToManyField(User, 'participated_in_events', blank=True)
    number_of_participants = PositiveIntegerField(null=True, blank=True)
    number_of_participants_under_26 = PositiveIntegerField(null=True, blank=True)

    # photos as Model below

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class EventPropagationImage(Model):
    event = ForeignKey(Event, on_delete=CASCADE, related_name='propagation_images')
    order = PositiveIntegerField()
    image = ImageField(upload_to='event_propagation_images')

    def image_tag(self):
        return mark_safe(f'<img style="max-height: 10rem; max-width: 20rem" src="{self.image.url}" />')

    image_tag.short_description = 'Náhled'

    class Meta:
        ordering = 'order',

    def __str__(self):
        return basename(self.image.name)


@translate_model
class EventPhoto(Model):
    event = ForeignKey(Event, on_delete=CASCADE, related_name='photos')
    photo = ImageField(upload_to='event_photos')

    def photo_tag(self):
        return mark_safe(f'<img style="max-height: 10rem; max-width: 20rem" src="{self.photo.url}" />')

    photo_tag.short_description = 'Náhled'

    class Meta:
        ordering = 'id',

    def __str__(self):
        return basename(self.photo.name)
