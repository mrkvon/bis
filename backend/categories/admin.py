from django.contrib import admin

from bis.admin_permissions import PermissionMixin
from categories.models import *


@admin.register(GrantCategory)
class GrantCategoryAdmin(PermissionMixin, admin.ModelAdmin):
    pass


@admin.register(PropagationIntendedForCategory)
class PropagationIntendedForCategoryAdmin(PermissionMixin, admin.ModelAdmin):
    pass


@admin.register(DietCategory)
class DietCategoryAdmin(PermissionMixin, admin.ModelAdmin):
    pass


@admin.register(QualificationCategory)
class QualificationCategoryAdmin(PermissionMixin, admin.ModelAdmin):
    list_display = 'slug', 'name', 'parent'


@admin.register(AdministrationUnitCategory)
class AdministrationUnitCategoryAdmin(PermissionMixin, admin.ModelAdmin):
    pass


@admin.register(MembershipCategory)
class MembershipCategoryAdmin(PermissionMixin, admin.ModelAdmin):
    pass


@admin.register(EventCategory)
class EventCategoryAdmin(PermissionMixin, admin.ModelAdmin):
    pass


@admin.register(EventProgramCategory)
class EventProgramCategoryAdmin(PermissionMixin, admin.ModelAdmin):
    pass


@admin.register(DonationSourceCategory)
class DonationSourceCategoryAdmin(PermissionMixin, admin.ModelAdmin):
    pass


@admin.register(OrganizerRoleCategory)
class OrganizerRoleCategoryAdmin(PermissionMixin, admin.ModelAdmin):
    pass


@admin.register(TeamRoleCategory)
class TeamRoleCategoryAdmin(PermissionMixin, admin.ModelAdmin):
    pass


@admin.register(OpportunityCategory)
class OpportunityCategoryAdmin(PermissionMixin, admin.ModelAdmin):
    pass
