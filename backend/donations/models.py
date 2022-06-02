from django.contrib.gis.db.models import *
from django.core.exceptions import ValidationError
from solo.models import SingletonModel

from administration_units.models import AdministrationUnit
from bis.models import User
from categories.models import DonationSourceCategory
from translation.translate import translate_model


def is_regional_center(value: AdministrationUnit):
    if value.category.slug != 'regional_center':
        raise ValidationError('not regional_center')


def is_basic_section(value: AdministrationUnit):
    if value.category.slug != 'basic_section':
        raise ValidationError('not basic_section')


@translate_model
class Donor(Model):
    user = OneToOneField(User, related_name='donor', on_delete=CASCADE)
    subscribed_to_newsletter = BooleanField(default=True)
    is_public = BooleanField(default=True)
    date_joined = DateField()
    regional_center_support = ForeignKey(AdministrationUnit, related_name='supported_as_regional_center',
                                         on_delete=CASCADE, null=True, blank=True, validators=[is_regional_center])
    basic_section_support = ForeignKey(AdministrationUnit, related_name='supported_as_basic_section',
                                       on_delete=CASCADE, null=True, blank=True, validators=[is_basic_section])

    def __str__(self):
        return f"{self.user}"

    class Meta:
        ordering = '-date_joined',

    def merge_with(self, other):
        assert other != self
        for field in self._meta.fields:
            if field.name in ['id', 'subscribed_to_newsletter', 'is_public', 'user']:
                continue

            elif field.name in ['regional_center_support', 'basic_section_support']:
                if not getattr(self, field.name) and getattr(other, field.name):
                    setattr(self, field.name, getattr(other, field.name))

            elif field.name in ['date_joined', ]:
                if getattr(other, field.name) < getattr(self, field.name):
                    setattr(self, field.name, getattr(other, field.name))
            else:
                raise RuntimeError(f'field {field.name} not checked, database was updated, merge is outdated')

        for relation in self._meta.related_objects:
            if isinstance(relation, ManyToOneRel) or isinstance(relation, OneToOneRel):
                for obj in relation.field.model.objects.filter(**{relation.field.name: other}):
                    setattr(obj, relation.field.name, self)
                    obj.save()

            elif isinstance(relation, ManyToManyRel):
                for obj in relation.field.model.objects.filter(**{relation.field.name: other}):
                    getattr(obj, relation.field.name).add(self)
                    getattr(obj, relation.field.name).remove(other)

        self.save()
        other.delete()


@translate_model
class VariableSymbol(Model):
    donor = ForeignKey(Donor, related_name='variable_symbols', on_delete=CASCADE)
    variable_symbol = PositiveBigIntegerField(unique=True)

    def __str__(self):
        return str(self.variable_symbol)

    class Meta:
        ordering = 'id',


@translate_model
class Donation(Model):
    donor = ForeignKey(Donor, on_delete=CASCADE, related_name='donations', null=True, blank=True)
    donated_at = DateField()
    amount = IntegerField()
    donation_source = ForeignKey(DonationSourceCategory, related_name='donations', on_delete=CASCADE)

    _variable_symbol = PositiveBigIntegerField(null=True, blank=True)
    info = TextField()


    def __str__(self):
        return f'{self.amount} Kč'

    class Meta:
        ordering = '-donated_at',


@translate_model
class UploadBankRecords(SingletonModel):
    file = FileField(upload_to='bank_records')

    def __str__(self):
        return 'Nahrání bankovního záznamu'

    class Meta:
        ordering = 'id',
