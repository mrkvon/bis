from os.path import basename

from django.contrib import admin
from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin, UserManager
from django.contrib.gis.db.models import *
from django.utils import timezone
from django.utils.safestring import mark_safe
from phonenumber_field.modelfields import PhoneNumberField

from administration_units.models import OrganizingUnit, BrontosaurusMovement
from categories.models import QualificationCategory
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

    @admin.display(description='Náhled')
    def photo_tag(self):
        return mark_safe(f'<img style="max-height: 10rem; max-width: 20rem" src="{self.photo.url}" />')

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
    def is_director(self):
        return BrontosaurusMovement.get().director == self

    @property
    def is_admin(self):
        return self in BrontosaurusMovement.get().bis_administrators.all()

    @property
    def is_office_worker(self):
        return self in BrontosaurusMovement.get().office_workers.all()

    @property
    def is_auditor(self):
        return self in BrontosaurusMovement.get().audit_committee.all()

    @property
    def is_executive(self):
        return self in BrontosaurusMovement.get().executive_committee.all()

    @property
    def is_education_member(self):
        return self in BrontosaurusMovement.get().education_members.all()

    @property
    def is_board_member(self):
        return self in BrontosaurusMovement.get().education_members.all()

    @property
    def is_staff(self):
        return self.is_director or self.is_admin or self.is_office_worker or self.is_auditor \
               or self.is_executive or self.is_education_member or self.is_board_member

    @property
    def is_superuser(self):
        return self.is_director or self.is_admin

    def has_usable_password(self):
        return False

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.get_name()

    @admin.display(description='Uživatel')
    def get_name(self):
        name = f'{self.first_name} {self.last_name}'
        if self.nickname:
            name = f'{self.nickname} ({name})'

        if len(name) == 1:
            return self.email

        return name

    @admin.display(description='Aktivní kvalifikace')
    def get_qualification(self):
        if self.qualification and self.qualification.valid_till >= timezone.now().date():
            return self.qualification

    @admin.display(description='Aktivní členství')
    def get_membership(self):
        return self.memberships.filter(year=timezone.now().year).first()


@translate_model
class Membership(Model):
    user = ForeignKey(User, on_delete=PROTECT, related_name='memberships')
    administrative_unit = ForeignKey(OrganizingUnit, on_delete=PROTECT, related_name='memberships')
    year = PositiveIntegerField()

    class Meta:
        ordering = 'id',

    def __str__(self):
        return f'Člen {self.administrative_unit} (rok {self.year})'


@translate_model
class Qualification(Model):
    user = OneToOneField(User, on_delete=PROTECT, related_name='qualification')
    category = ForeignKey(QualificationCategory, on_delete=PROTECT, related_name='qualifications')
    valid_till = DateField()

    class Meta:
        ordering = 'id',

    def __str__(self):
        return f'{self.category} (do {self.valid_till})'
