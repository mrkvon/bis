from django.contrib import admin
from solo.admin import SingletonModelAdmin

from administration_units.models import AdministrationUnit, BrontosaurusMovement
from bis.admin_helpers import EditableByAdminOnlyMixin


@admin.register(AdministrationUnit)
class AdministrationUnitAdmin(EditableByAdminOnlyMixin, admin.ModelAdmin):
    list_display = 'abbreviation', 'address', 'phone', 'email', 'www', 'chairman', 'category'
    search_fields = 'abbreviation', 'name', 'address__city', 'address__street', 'address__zip_code', 'phone', 'email'
    list_filter = 'category', 'is_for_kids'

    autocomplete_fields = 'chairman', 'manager', 'board_members'

    exclude = '_import_id',
    list_select_related = 'address', 'chairman', 'category'


@admin.register(BrontosaurusMovement)
class BrontosaurusMovementAdmin(EditableByAdminOnlyMixin, SingletonModelAdmin):
    filter_horizontal = 'bis_administrators', 'office_workers', 'audit_committee', \
                        'executive_committee', 'education_members',

    autocomplete_fields = 'director', 'bis_administrators', 'office_workers', 'audit_committee', \
                          'executive_committee', 'education_members'

    def has_add_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False