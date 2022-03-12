from django.contrib import admin

from administration_units.models import OrganizingUnit, BrontosaurusMovement
from bis.admin_helpers import EditableByAdminOnlyMixin


@admin.register(OrganizingUnit)
class OrganizingUnitAdmin(EditableByAdminOnlyMixin, admin.ModelAdmin):
    list_display = 'name',
    search_fields = 'name',
    filter_horizontal = 'board_members',


@admin.register(BrontosaurusMovement)
class BrontosaurusMovementAdmin(EditableByAdminOnlyMixin, admin.ModelAdmin):
    filter_horizontal = 'bis_administrators', 'office_workers', 'audit_committee', 'executive_committee', 'education_members',
