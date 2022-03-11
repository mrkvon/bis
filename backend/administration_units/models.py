from django.contrib.gis.db.models import *

from translation.translate import translate_model


@translate_model
class OrganizingUnit(Model):
    name = CharField(max_length=63)
    board_members = ManyToManyField('bis.User', related_name='organizing_units')

    class Meta:
        ordering = 'id',

    def __str__(self):
        return self.name


@translate_model
class BrontosaurusMovement(Model):
    director = ForeignKey('bis.User', related_name='+', on_delete=PROTECT)
    bis_administrators = ManyToManyField('bis.User', related_name='+')
    office_workers = ManyToManyField('bis.User', related_name='+')
    audit_committee = ManyToManyField('bis.User', related_name='+')
    executive_committee = ManyToManyField('bis.User', related_name='+')
    education_members = ManyToManyField('bis.User', related_name='+')

    cache = None

    @classmethod
    def get(cls):
        if cls.cache is None:
            cls.cache = cls.objects.first()

        return cls.cache

    def __str__(self):
        return "Hnutí Brontosaurus"
