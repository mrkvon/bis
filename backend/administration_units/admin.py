from django.contrib import admin

from administration_units.models import AdministrationUnit, BrontosaurusMovement
from bis.admin_helpers import EditableByAdminOnlyMixin


@admin.register(AdministrationUnit)
class AdministrationUnitAdmin(EditableByAdminOnlyMixin, admin.ModelAdmin):
    list_display = 'name',
    search_fields = 'name',
    filter_horizontal = 'board_members',

    autocomplete_fields = 'chairman', 'manager', 'board_members'

    exclude = '_import_id',


@admin.register(BrontosaurusMovement)
class BrontosaurusMovementAdmin(EditableByAdminOnlyMixin, admin.ModelAdmin):
    filter_horizontal = 'bis_administrators', 'office_workers', 'audit_committee', \
                        'executive_committee', 'education_members',

    autocomplete_fields = 'director', 'bis_administrators', 'office_workers', 'audit_committee', \
                          'executive_committee', 'education_members'
