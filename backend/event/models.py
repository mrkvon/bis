from os.path import basename

from django.contrib import admin
from django.contrib.gis.db.models import *
from django.utils.safestring import mark_safe

from bis.models import Location, AdministrativeUnit, User
from categories.models import FinanceCategory, GrantCategory, PropagationIntendedForCategory, DietCategory
from translation.translate import translate_model


@translate_model
class Event(Model):
    # general
    name = CharField(max_length=63)
    is_canceled = BooleanField(default=False)
    start = DateTimeField()
    end = DateField()
    location = ForeignKey(Location, on_delete=PROTECT, related_name='events')

    administrative_unit = ForeignKey(AdministrativeUnit, on_delete=PROTECT, related_name='events')
    main_organizer = ForeignKey(User, on_delete=PROTECT, related_name='+')
    other_organizers = ManyToManyField(User, related_name='+', blank=True)

    is_internal = BooleanField(default=False)
    number_of_sub_events = PositiveIntegerField(default=1)

    class Meta:
        ordering = 'id',
        app_label = 'bis'

    def __str__(self):
        return self.name


@translate_model
class EventFinance(Model):
    event = OneToOneField(Event, related_name='finance', on_delete=CASCADE)

    category = ForeignKey(FinanceCategory, on_delete=PROTECT, related_name='events')
    grant_source = ForeignKey(GrantCategory, on_delete=PROTECT, related_name='events', null=True, blank=True)
    grant_amount = PositiveIntegerField(null=True, blank=True)
    total_event_cost = PositiveIntegerField(null=True, blank=True)
    budget = FileField(upload_to='budgets', blank=True)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return f'Finance k události {self.event}'


@translate_model
class EventPropagation(Model):
    event = OneToOneField(Event, related_name='propagation', on_delete=CASCADE)

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

    class Meta:
        ordering = 'id',

    def __str__(self):
        return f'Propagace k události {self.event}'


@translate_model
class EventRegistration(Model):
    event = OneToOneField(Event, related_name='registration', on_delete=CASCADE)

    is_registration_required = BooleanField(default=True)
    is_event_full = BooleanField(default=False)

    # filled answers as part of questionary

    class Meta:
        ordering = 'id',

    def __str__(self):
        return f'Registrace k události {self.event}'


@translate_model
class EventRecord(Model):
    event = OneToOneField(Event, related_name='record', on_delete=CASCADE)

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
        return f'Záznam k události {self.event}'


@translate_model
class EventPropagationImage(Model):
    propagation = ForeignKey(EventPropagation, on_delete=CASCADE, related_name='propagation_images')
    order = PositiveIntegerField()
    image = ImageField(upload_to='event_propagation_images')

    @admin.display(description='Náhled')
    def image_tag(self):
        return mark_safe(f'<img style="max-height: 10rem; max-width: 20rem" src="{self.image.url}" />')

    class Meta:
        ordering = 'order',

    def __str__(self):
        return basename(self.image.name)


@translate_model
class EventPhoto(Model):
    record = ForeignKey(EventRecord, on_delete=CASCADE, related_name='photos')
    photo = ImageField(upload_to='event_photos')

    @admin.display(description='Náhled')
    def photo_tag(self):
        return mark_safe(f'<img style="max-height: 10rem; max-width: 20rem" src="{self.photo.url}" />')

    class Meta:
        ordering = 'id',

    def __str__(self):
        return basename(self.photo.name)
