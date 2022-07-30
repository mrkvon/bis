from django.contrib import admin

from bis.admin_permissions import ReadOnlyMixin
from categories.models import *


@admin.register(GrantCategory)
class GrantCategoryAdmin(ReadOnlyMixin, admin.ModelAdmin):
    pass


@admin.register(PropagationIntendedForCategory)
class PropagationIntendedForCategoryAdmin(ReadOnlyMixin, admin.ModelAdmin):
    pass


@admin.register(DietCategory)
class DietCategoryAdmin(ReadOnlyMixin, admin.ModelAdmin):
    pass


@admin.register(QualificationCategory)
class QualificationCategoryAdmin(ReadOnlyMixin, admin.ModelAdmin):
    list_display = 'slug', 'name', 'parent'


@admin.register(AdministrationUnitCategory)
class AdministrationUnitCategoryAdmin(ReadOnlyMixin, admin.ModelAdmin):
    pass


@admin.register(MembershipCategory)
class MembershipCategoryAdmin(ReadOnlyMixin, admin.ModelAdmin):
    pass


@admin.register(EventCategory)
class EventCategoryAdmin(ReadOnlyMixin, admin.ModelAdmin):
    pass


@admin.register(EventProgramCategory)
class EventProgramCategoryAdmin(ReadOnlyMixin, admin.ModelAdmin):
    pass


@admin.register(DonationSourceCategory)
class DonationSourceCategoryAdmin(ReadOnlyMixin, admin.ModelAdmin):
    pass


@admin.register(OrganizerRoleCategory)
class OrganizerRoleCategoryAdmin(ReadOnlyMixin, admin.ModelAdmin):
    pass


@admin.register(TeamRoleCategory)
class TeamRoleCategoryAdmin(ReadOnlyMixin, admin.ModelAdmin):
    pass


@admin.register(OpportunityCategory)
class OpportunityCategoryAdmin(ReadOnlyMixin, admin.ModelAdmin):
    pass
