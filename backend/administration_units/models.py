from django.contrib.gis.db.models import *
from django.core.cache import cache
from phonenumber_field.modelfields import PhoneNumberField

from categories.models import AdministrationUnitCategory, AdministrationUnitBoardMemberCategory
from translation.translate import translate_model
from solo.models import SingletonModel


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
    chairman = ForeignKey('bis.User', related_name='+', on_delete=CASCADE, null=True)
    manager = ForeignKey('bis.User', related_name='+', on_delete=CASCADE, null=True)
    board_members = ManyToManyField('bis.User', related_name='administration_units')

    _import_id = CharField(max_length=15, default='')

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class AdministrationUnitAddress(Model):
    administration_unit = OneToOneField(AdministrationUnit, on_delete=CASCADE, related_name='address')
    street = CharField(max_length=127)
    city = CharField(max_length=63)
    zip_code = CharField(max_length=5)

    class Meta:
        ordering = 'id',

    def __str__(self):
        return f'Adresa {self.administration_unit})'


@translate_model
class AdministrationUnitMember(Model):
    user = ForeignKey('bis.User', related_name='+', on_delete=CASCADE)
    administration_unit = ForeignKey(AdministrationUnit, on_delete=CASCADE)
    category = ForeignKey(AdministrationUnitBoardMemberCategory, on_delete=CASCADE)
    since = DateTimeField()
    till = DateTimeField()

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class BrontosaurusMovement(SingletonModel):
    director = ForeignKey('bis.User', related_name='+', on_delete=CASCADE, null=True)
    bis_administrators = ManyToManyField('bis.User', related_name='+')
    office_workers = ManyToManyField('bis.User', related_name='+')
    audit_committee = ManyToManyField('bis.User', related_name='+')
    executive_committee = ManyToManyField('bis.User', related_name='+')
    education_members = ManyToManyField('bis.User', related_name='+')

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
