import re

from django.apps import apps
from django.contrib.gis.db.models import *
from django.core.cache import cache
from phonenumber_field.modelfields import PhoneNumberField
from solo.models import SingletonModel

from categories.models import AdministrationUnitCategory
from translation.translate import translate_model


class BaseAddress(Model):
    street = CharField(max_length=127)
    city = CharField(max_length=63)
    zip_code = CharField(max_length=5)
    region = ForeignKey('other.Region', related_name='+', on_delete=CASCADE, null=True, blank=True)

    class Meta:
        ordering = 'id',
        abstract = True

    def __str__(self):
        return f'{self.street}, {self.city}, {self.zip_code}'

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        self.zip_code = re.sub(r'\s+', '', str(self.zip_code))[:5]
        zip_code = apps.get_model('other', 'ZipCode').objects.filter(zip_code=self.zip_code).first()
        if zip_code and zip_code.region:
            self.region = zip_code.region
        super().save(force_insert, force_update, using, update_fields)


@translate_model
class AdministrationUnit(Model):
    name = CharField(max_length=255)
    abbreviation = CharField(max_length=63)

    is_for_kids = BooleanField()

    phone = PhoneNumberField(null=True)
    email = EmailField(null=True)
    www = URLField(null=True)
    ic = CharField(max_length=15, null=True)
    bank_account_number = CharField(max_length=63, null=True, blank=True)

    existed_since = DateField(null=True)
    existed_till = DateField(null=True, blank=True)

    category = ForeignKey(AdministrationUnitCategory, related_name='administration_units', on_delete=CASCADE)
    chairman = ForeignKey('bis.User', related_name='chairman_of', on_delete=CASCADE, null=True)
    vice_chairman = ForeignKey('bis.User', related_name='vice_chairman_of', on_delete=CASCADE, null=True)
    manager = ForeignKey('bis.User', related_name='manager_of', on_delete=CASCADE, null=True)
    board_members = ManyToManyField('bis.User', related_name='administration_units')

    _import_id = CharField(max_length=15, default='')

    class Meta:
        ordering = 'abbreviation',

    def __str__(self):
        return self.abbreviation


@translate_model
class AdministrationUnitAddress(BaseAddress):
    administration_unit = OneToOneField(AdministrationUnit, on_delete=CASCADE, related_name='address')


@translate_model
class AdministrationUnitContactAddress(BaseAddress):
    administration_unit = OneToOneField(AdministrationUnit, on_delete=CASCADE, related_name='contact_address')


@translate_model
class BrontosaurusMovement(SingletonModel):
    director = ForeignKey('bis.User', related_name='director_of', on_delete=CASCADE)
    finance_director = ForeignKey('bis.User', related_name='finance_director_of', on_delete=CASCADE)
    bis_administrators = ManyToManyField('bis.User', related_name='+', blank=True)
    office_workers = ManyToManyField('bis.User', related_name='+', blank=True)
    audit_committee = ManyToManyField('bis.User', related_name='+', blank=True)
    executive_committee = ManyToManyField('bis.User', related_name='+', blank=True)
    education_members = ManyToManyField('bis.User', related_name='+', blank=True)

    @classmethod
    def get(cls):
        obj = cache.get('brontosaurus_movement')
        if not obj:
            obj = cls.objects.get()
            cache.set('brontosaurus_movement', obj)

        return obj

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        self.cache = None
        super().save(force_insert, force_update, using, update_fields)

    def __str__(self):
        return "Hnutí Brontosaurus"
