from django.contrib.gis.db.models import *

from bis.models import User
from translation.translate import translate_model


@translate_model
class Region(Model):
    name = CharField(max_length=63)
    area = PolygonField()

    def __str__(self):
        return self.name

    class Meta:
        ordering = 'id',


@translate_model
class DuplicateUser(Model):
    user = ForeignKey(User, on_delete=CASCADE, related_name='duplicates')
    other = ForeignKey(User, on_delete=CASCADE, related_name='other_duplicates')

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        if self.user == self.other:
            if not self._state.adding:
                self.delete()

            return

        super().save(force_insert, force_update, using, update_fields)

    @classmethod
    def filter_queryset(cls, queryset, user):
        visible_users = User.filter_queryset(User.objects.all(), user)
        return queryset.filter(user__in=visible_users, other__in=visible_users)

    def can_be_merged_by(self, user):
        if user.is_superuser: return True
        if user.is_office_worker:
            return not (self.user.is_superuser or self.other.is_superuser)
        return False

    def __str__(self):
        return 'Duplicita'

    class Meta:
        ordering = 'id',
