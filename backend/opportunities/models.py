from django.contrib.gis.db.models import *
from django.core.exceptions import ValidationError
from tinymce.models import HTMLField

from bis.models import User, Location
from categories.models import EventProgramCategory, TeamRoleCategory, OrganizerRoleCategory, OpportunityCategory
from translation.translate import translate_model


@translate_model
class Opportunity(Model):
    category = ForeignKey(OpportunityCategory, on_delete=CASCADE, related_name='opportunities')
    name = CharField(max_length=63)
    start = DateField()
    end = DateField()
    on_web_start = DateField()
    on_web_end = DateField()
    location = ForeignKey(Location, on_delete=CASCADE, related_name='opportunities')

    introduction = HTMLField()
    description = HTMLField()
    location_benefits = HTMLField(blank=True)
    personal_benefits = HTMLField()
    requirements = HTMLField()

    contact_person = ForeignKey(User, on_delete=CASCADE, related_name='opportunities')
    image = ImageField(upload_to='opportunity_images')

    def clean(self):
        if not (self.category.slug == 'collaboration' or self.location_benefits):
            raise ValidationError('Pokud kategorie spolupráce není Spolupráce, přínos pro lokalitu musí být vyplněn')

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        self.clean()
        super().save(force_insert, force_update, using, update_fields)

    def __str__(self):
        return self.name

    class Meta:
        ordering = 'id',


@translate_model
class OfferedHelp(Model):
    user = OneToOneField(User, on_delete=CASCADE, related_name='offers')

    programs = ManyToManyField(EventProgramCategory, related_name='offered_help')
    organizer_roles = ManyToManyField(OrganizerRoleCategory, related_name='offered_help')
    additional_organizer_role = CharField(max_length=63)
    team_roles = ManyToManyField(TeamRoleCategory, related_name='offered_help')
    additional_team_role = CharField(max_length=63)

    info = TextField()

    def __str__(self):
        return self.info

    class Meta:
        ordering = 'id',
