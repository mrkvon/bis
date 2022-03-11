from django.contrib import admin

from administration_units.models import OrganizingUnit, BrontosaurusMovement


@admin.register(OrganizingUnit)
class OrganizingUnitAdmin(admin.ModelAdmin):
    list_display = 'name',
    search_fields = 'name',
    filter_horizontal = 'board_members',

    def has_add_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(BrontosaurusMovement)
class BrontosaurusMovementAdmin(admin.ModelAdmin):
    filter_horizontal = 'bis_administrators', 'office_workers', 'audit_committee', 'executive_committee', 'education_members',
    def has_add_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser
