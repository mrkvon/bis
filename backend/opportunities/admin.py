from nested_admin.nested import NestedModelAdmin

from bis.admin_helpers import EditableByAdminOnlyMixin
from event.models import *
from opportunities.models import Opportunity, OfferedHelp


@admin.register(Opportunity)
class OpportunityAdmin(EditableByAdminOnlyMixin, NestedModelAdmin):
    autocomplete_fields = 'location', 'contact_person'
    save_as = True
    pass


@admin.register(OfferedHelp)
class OfferedHelpAdmin(EditableByAdminOnlyMixin, NestedModelAdmin):
    autocomplete_fields = 'user',
