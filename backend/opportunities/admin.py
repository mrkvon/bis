from more_admin_filters import MultiSelectRelatedDropdownFilter
from nested_admin.nested import NestedModelAdmin
from rangefilter.filters import DateRangeFilter

from bis.admin_helpers import EditableByOfficeMixin
from event.models import *
from opportunities.models import Opportunity, OfferedHelp


@admin.register(Opportunity)
class OpportunityAdmin(EditableByOfficeMixin, NestedModelAdmin):
    list_display = 'name', 'category', 'contact_person', 'start', 'end', 'on_web_start', 'on_web_end', 'location'
    autocomplete_fields = 'location', 'contact_person'
    save_as = True

    list_select_related = 'category', 'contact_person'
    list_filter = 'category', ('start', DateRangeFilter), ('end', DateRangeFilter),

    search_fields = 'name', 'introduction'


@admin.register(OfferedHelp)
class OfferedHelpAdmin(EditableByOfficeMixin, NestedModelAdmin):
    autocomplete_fields = 'user',
    list_display = 'user', 'get_programs', 'get_organizer_roles', 'get_team_roles'
    search_fields = 'user', 'additional_organizer_role', 'additional_team_role', 'info'
    list_filter = ('programs', MultiSelectRelatedDropdownFilter), \
                  ('organizer_roles', MultiSelectRelatedDropdownFilter), \
                  ('team_roles', MultiSelectRelatedDropdownFilter)

    @admin.display(description='Programy')
    def get_programs(self, obj):
        return mark_safe('<br>'.join([str(item) for item in obj.programs.all()]))

    @admin.display(description='Organizátorské role')
    def get_organizer_roles(self, obj):
        return mark_safe('<br>'.join([str(item) for item in obj.organizer_roles.all()]))

    @admin.display(description='Týmové role')
    def get_team_roles(self, obj):
        return mark_safe('<br>'.join([str(item) for item in obj.team_roles.all()]))
