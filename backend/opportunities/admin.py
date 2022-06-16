from nested_admin.nested import NestedModelAdmin
from rangefilter.filters import DateRangeFilter

from bis.admin_helpers import EditableByAdminOnlyMixin
from event.models import *
from opportunities.models import Opportunity, OfferedHelp


@admin.register(Opportunity)
class OpportunityAdmin(EditableByAdminOnlyMixin, NestedModelAdmin):
    list_display = 'name', 'category', 'contact_person', 'start', 'end', 'on_web_start', 'on_web_end', 'location'
    autocomplete_fields = 'location', 'contact_person'
    save_as = True

    list_select_related = 'category', 'contact_person'
    list_filter = 'category', ('start', DateRangeFilter), ('end', DateRangeFilter),

    search_fields = 'name', 'introduction'


@admin.register(OfferedHelp)
class OfferedHelpAdmin(EditableByAdminOnlyMixin, NestedModelAdmin):
    autocomplete_fields = 'user',
