from functools import cached_property
from os.path import basename

from django.contrib import admin
from django.contrib.auth.models import UserManager
from django.contrib.gis.db.models import *
from django.utils import timezone
from django.utils.safestring import mark_safe
from phonenumber_field.modelfields import PhoneNumberField

from administration_units.models import AdministrationUnit, BrontosaurusMovement
from categories.models import QualificationCategory, MembershipCategory
from translation.translate import translate_model


@translate_model
class Location(Model):
    name = CharField(max_length=63)
    patron = ForeignKey('bis.User', on_delete=CASCADE, related_name='locations', null=True)
    address = CharField(max_length=255, null=True)
    gps_location = PointField(null=True)

    _import_id = CharField(max_length=15, default='')

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
class User(Model):
    REQUIRED_FIELDS = []
    USERNAME_FIELD = 'id'

    first_name = CharField(max_length=63, blank=True)
    last_name = CharField(max_length=63, blank=True)
    nickname = CharField(max_length=63, blank=True)
    phone = PhoneNumberField(blank=True)
    birthday = DateField(blank=True, null=True)

    last_login = DateTimeField(blank=True, null=True)

    is_active = BooleanField(default=True)
    date_joined = DateTimeField(default=timezone.now)

    _import_id = CharField(max_length=15, default='')

    objects = UserManager()

    @cached_property
    def email(self):
        return self.emails.first().email

    @cached_property
    def is_director(self):
        return BrontosaurusMovement.get().director == self

    @cached_property
    def is_director(self):
        return BrontosaurusMovement.get().director == self

    @cached_property
    def is_admin(self):
        return self in BrontosaurusMovement.get().bis_administrators.all()

    @cached_property
    def is_office_worker(self):
        return self in BrontosaurusMovement.get().office_workers.all()

    @cached_property
    def is_auditor(self):
        return self in BrontosaurusMovement.get().audit_committee.all()

    @cached_property
    def is_executive(self):
        return self in BrontosaurusMovement.get().executive_committee.all()

    @cached_property
    def is_education_member(self):
        return self in BrontosaurusMovement.get().education_members.all()

    @cached_property
    def is_board_member(self):
        return AdministrationUnit.objects.filter(board_members=self).exists()

    @cached_property
    def can_see_all(self):
        return self.is_director or self.is_admin or self.is_office_worker or self.is_auditor \
               or self.is_executive

    @cached_property
    def is_staff(self):
        return self.is_director or self.is_admin or self.is_office_worker or self.is_auditor \
               or self.is_executive or self.is_education_member or self.is_board_member

    @cached_property
    def is_superuser(self):
        return self.is_director or self.is_admin

    def has_usable_password(self):
        return False

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_anonymous(self):
        return False

    @property
    def is_authenticated(self):
        return True

    def get_username(self):
        return None

    class Meta:
        ordering = '-id',

    def __str__(self):
        return self.get_name()

    def merge_with(self, other):
        assert other != self
        if other.user.id > self.id:
            return other.merge_with(self)

        for field in self._meta.fields:
            assert field.name in ['first_name', 'last_name', 'nickname', 'phone',
                                  'birthday', 'email']

            if field.name in ['id', 'password', '_import_id', 'is_active', 'last_login']:
                continue

            elif field.name in ['date_joined', ]:
                if getattr(other, field.name) < getattr(self, field.name):
                    setattr(self, field.name, getattr(other, field.name))

            elif field.name == 'email':
                pass





            else:
                raise RuntimeError('field not checked, database was updated, merge is outdated')

        print('')
        return

    @admin.display(description='Uživatel')
    def get_name(self):
        name = f'{self.first_name} {self.last_name}'
        if self.nickname:
            name = f'{self.nickname} ({name})'

        if len(name) == 1:
            return f"{self.emails.first()}"

        return name

    @admin.display(description='E-mailové adresy')
    def get_emails(self):
        return "\n".join(e.email for e in self.emails.all())

    @admin.display(description='Aktivní kvalifikace')
    def get_qualifications(self):
        return [q for q in self.qualifications.all() if q.valid_till >= timezone.now().date()]

    @admin.display(description='Aktivní členství')
    def get_memberships(self):
        return [m for m in self.memberships.all() if m.year == timezone.now().year]

    @classmethod
    def filter_queryset(cls, queryset, user):
        if user.can_see_all or user.is_education_member:
            return queryset

        return queryset.filter(
            # ja
            Q(id=user.id)
            # lidi kolem akci od clanku kde user je board member
            | Q(participated_in_events__event__administration_unit__board_members=user)
            | Q(events_where_was_as_main_organizer__administration_unit__board_members=user)
            | Q(events_where_was_as_other_organizer__administration_unit__board_members=user)
            | Q(events_where_was_as_contact_person__event__administration_unit__board_members=user)
            # lidi kolem akci, kde user byl hlavas
            | Q(participated_in_events__event__main_organizer=user)
            | Q(events_where_was_as_other_organizer__main_organizer=user)
            | Q(events_where_was_as_contact_person__event__main_organizer=user)
            # lidi kolem akci, kde user byl other organizer
            | Q(participated_in_events__event__other_organizers=user)
            | Q(events_where_was_as_main_organizer__other_organizers=user)
            | Q(events_where_was_as_other_organizer__other_organizers=user)
            | Q(events_where_was_as_contact_person__event__other_organizers=user)
            # lidi kolem akci, kde user byl kontaktni osoba
            | Q(participated_in_events__event__propagation__contact_person=user)
            | Q(events_where_was_as_main_organizer__propagation__contact_person=user)
            | Q(events_where_was_as_other_organizer__propagation__contact_person=user)
            | Q(events_where_was_as_contact_person__event__propagation__contact_person=user)
            # orgove akci, kde user byl ucastnik
            | Q(events_where_was_as_main_organizer__record__participants=user)
            | Q(events_where_was_as_other_organizer__record__participants=user)
            | Q(events_where_was_as_contact_person__event__record__participants=user)
            # # # ostatni ucastnici akci, kde jsem byl
            # participated_in_events__participants=user,
        ).distinct()


@translate_model
class UserEmail(Model):
    user = ForeignKey(User, related_name='emails', on_delete=CASCADE)
    email = EmailField(unique=True)
    order = PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = 'order',

    def __str__(self):
        return f'Email {self.email}'


@translate_model
class UserAddress(Model):
    user = OneToOneField(User, on_delete=CASCADE, related_name='address')
    street = CharField(max_length=127)
    city = CharField(max_length=63)
    zip_code = CharField(max_length=5)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return f'{self.street}, {self.city}, {self.zip_code}'


@translate_model
class Membership(Model):
    user = ForeignKey(User, on_delete=CASCADE, related_name='memberships')
    category = ForeignKey(MembershipCategory, on_delete=CASCADE, related_name='memberships')
    administration_unit = ForeignKey(AdministrationUnit, on_delete=CASCADE, related_name='memberships')
    year = PositiveIntegerField()

    _import_id = CharField(max_length=15, default='')

    class Meta:
        ordering = 'id',

    def __str__(self):
        return f'Člen {self.administration_unit} (rok {self.year})'


@translate_model
class Qualification(Model):
    user = ForeignKey(User, on_delete=CASCADE, related_name='qualifications')
    category = ForeignKey(QualificationCategory, on_delete=CASCADE, related_name='qualifications')
    valid_since = DateField()
    valid_till = DateField()
    approved_by = ForeignKey(User, on_delete=CASCADE, related_name='approved_qualifications')

    _import_id = CharField(max_length=15, default='')

    class Meta:
        ordering = 'id',

    def __str__(self):
        return f'{self.category} (od {self.valid_since} do {self.valid_till})'
