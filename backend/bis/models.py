from functools import cached_property
from os.path import basename

from dateutil.relativedelta import relativedelta
from django.contrib import admin
from django.contrib.auth.models import UserManager
from django.contrib.gis.db.models import *
from django.utils import timezone
from django.utils.safestring import mark_safe
from django.utils.timezone import now
from phonenumber_field.modelfields import PhoneNumberField

from administration_units.models import AdministrationUnit, BrontosaurusMovement, BaseAddress
from bis.admin_helpers import get_admin_edit_url
from categories.models import QualificationCategory, MembershipCategory, LocationProgram, LocationAccessibility
from translation.translate import translate_model


@translate_model
class Location(Model):
    name = CharField(max_length=63)
    description = TextField()

    patron = ForeignKey('bis.User', on_delete=CASCADE, related_name='patron_of', null=True)
    contact_person = ForeignKey('bis.User', on_delete=CASCADE, related_name='locations_where_is_contact_person', null=True)

    for_beginners = BooleanField(default=False)
    is_full = BooleanField(default=False)
    is_unexplored = BooleanField(default=False)

    program = ForeignKey(LocationProgram, on_delete=CASCADE, null=True, blank=True)
    accessibility_from_prague = ForeignKey(LocationAccessibility, on_delete=CASCADE, related_name='+', null=True)
    accessibility_from_brno = ForeignKey(LocationAccessibility, on_delete=CASCADE, related_name='+', null=True)

    volunteering_work = TextField()
    volunteering_work_done = TextField()
    volunteering_work_goals = TextField()
    options_around = TextField()
    facilities = TextField()

    web = URLField(blank=True)
    address = CharField(max_length=255, blank=True)
    gps_location = PointField(null=True)
    region = ForeignKey('other.Region', related_name='locations', on_delete=CASCADE, null=True, blank=True)

    _import_id = CharField(max_length=15, default='')

    class Meta:
        ordering = 'name',

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

    close_person = ForeignKey('bis.User', on_delete=SET_NULL, null=True, blank=True)

    last_login = DateTimeField(blank=True, null=True)

    is_active = BooleanField(default=True)
    date_joined = DateField(default=timezone.now)

    _import_id = CharField(max_length=15, default='')
    _str = CharField(max_length=255)

    objects = UserManager()

    @cached_property
    def email(self):
        email = self.emails.first()
        return email and email.email

    @cached_property
    def is_director(self):
        return BrontosaurusMovement.get().director == self or BrontosaurusMovement.get().finance_director == self

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
        return self.is_superuser or self.is_office_worker or self.is_auditor \
               or self.is_executive

    @cached_property
    def is_staff(self):
        return self.is_superuser or self.is_office_worker or self.is_auditor \
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

    @property
    def age(self):
        if self.birthday:
            return relativedelta(now().date(), self.birthday).years

    def get_username(self):
        return None

    class Meta:
        ordering = '-id',

    def __str__(self):
        return self._str

    def merge_with(self, other):
        assert other != self
        for field in self._meta.fields:
            if field.name in ['id', 'password', '_import_id', 'is_active', 'last_login']:
                continue

            elif field.name in ['date_joined', ]:
                if getattr(other, field.name) < getattr(self, field.name):
                    setattr(self, field.name, getattr(other, field.name))

            elif field.name in ['first_name', 'last_name', 'nickname', 'phone',
                                'birthday']:
                if not getattr(self, field.name) and getattr(other, field.name):
                    setattr(self, field.name, getattr(other, field.name))

            else:
                raise RuntimeError(f'field {field.name} not checked, database was updated, merge is outdated')

        for relation in self._meta.related_objects:
            if relation.name in ['auth_token']:
                continue

            elif relation.name in ['address', 'contact_address']:
                if not hasattr(self, relation.name) and hasattr(other, relation.name):
                    setattr(self, relation.name, getattr(other, relation.name))

            elif relation.name == 'donor':
                if hasattr(other, relation.name):
                    if not hasattr(self, relation.name):
                        setattr(self, relation.name, getattr(other, relation.name))
                    else:
                        self.donor.merge_with(other.donor)

            elif relation.name == 'emails':
                max_order = max([email.order for email in self.emails.all()] + [0])
                for i, obj in enumerate(UserEmail.objects.filter(user=other)):
                    obj.user = self
                    obj.order = max_order + i + 1
                    obj.save()

            elif isinstance(relation, ManyToOneRel) or isinstance(relation, OneToOneRel):
                for obj in relation.field.model.objects.filter(**{relation.field.name: other}):
                    setattr(obj, relation.field.name, self)
                    obj.save()

            elif isinstance(relation, ManyToManyRel):
                for obj in relation.field.model.objects.filter(**{relation.field.name: other}):
                    getattr(obj, relation.field.name).add(self)
                    getattr(obj, relation.field.name).remove(other)

            else:
                raise RuntimeError('should not happen :)')

        self.save()
        other.delete()

    @admin.display(description='Uživatel')
    def get_name(self):
        name = f'{self.first_name} {self.last_name}'.strip()
        if self.nickname:
            if name:
                name = f'{self.nickname} ({name})'
            else:
                name = self.nickname

        if not name.strip():
            return f"{self.emails.first()}"

        return name

    def get_short_name(self): # for admin
        return self.get_name()

    @admin.display(description='E-mailové adresy')
    def get_emails(self):
        def split_email(email):
            name, host = email.split('@')
            return f'{name}<br>@{host}'

        return mark_safe("<br>".join(split_email(e.email) for e in self.emails.all()))

    @admin.display(description='Aktivní kvalifikace')
    def get_qualifications(self):
        return [q for q in self.qualifications.all() if q.valid_till >= timezone.now().date()]

    @admin.display(description='Aktivní členství')
    def get_memberships(self):
        return [m for m in self.memberships.all() if m.year == timezone.now().year]

    @admin.display(description='Zorganizované akce')
    def get_events_where_was_organizer(self):
        return mark_safe(', '.join(get_admin_edit_url(e) for e in self.events_where_was_organizer.all()))

    @admin.display(description='Akce, kde byl účastníkem')
    def get_participated_in_events(self):
        return mark_safe(', '.join(get_admin_edit_url(e.event) for e in self.participated_in_events.all()))

    @classmethod
    def filter_queryset(cls, queryset, user):
        if user.is_education_member:
            return queryset

        ids = set()
        for query in [
            # ja
            Q(id=user.id),
            # lidi kolem akci od clanku kde user je board member
            Q(participated_in_events__event__administration_units__board_members=user),
            Q(events_where_was_organizer__administration_units__board_members=user),
            Q(events_where_was_as_contact_person__event__administration_units__board_members=user),
            # lidi kolem akci, kde user byl other organizer
            Q(participated_in_events__event__other_organizers=user),
            Q(events_where_was_organizer__other_organizers=user),
            Q(events_where_was_as_contact_person__event__other_organizers=user),
            # lidi kolem akci, kde user byl kontaktni osoba
            Q(participated_in_events__event__propagation__contact_person=user),
            Q(events_where_was_organizer__propagation__contact_person=user),
            Q(events_where_was_as_contact_person__event__propagation__contact_person=user),
            # orgove akci, kde user byl ucastnik
            Q(events_where_was_organizer__record__participants=user),
            Q(events_where_was_as_contact_person__event__record__participants=user)
            # # # ostatni ucastnici akci, kde jsem byl
            # participated_in_events__participants=user,
        ]:
            ids = ids.union(queryset.filter(query).order_by().values_list('id', flat=True))

        return User.objects.filter(id__in=ids)


@translate_model
class UserEmail(Model):
    user = ForeignKey(User, related_name='emails', on_delete=CASCADE)
    email = EmailField(unique=True)
    order = PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = 'order',

    def __str__(self):
        return self.email


@translate_model
class UserAddress(BaseAddress):
    user = OneToOneField(User, on_delete=CASCADE, related_name='address')


@translate_model
class UserContactAddress(BaseAddress):
    user = OneToOneField(User, on_delete=CASCADE, related_name='contact_address')


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
