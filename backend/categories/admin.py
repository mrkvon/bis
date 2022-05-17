from django.contrib import admin

from bis.admin_helpers import EditableByAdminOnlyMixin
from categories.models import *


@admin.register(GrantCategory)
class GrantCategoryAdmin(EditableByAdminOnlyMixin, admin.ModelAdmin):
    pass


@admin.register(PropagationIntendedForCategory)
class PropagationIntendedForCategoryAdmin(EditableByAdminOnlyMixin, admin.ModelAdmin):
    pass


@admin.register(DietCategory)
class DietCategoryAdmin(EditableByAdminOnlyMixin, admin.ModelAdmin):
    pass


@admin.register(QualificationCategory)
class QualificationCategoryAdmin(EditableByAdminOnlyMixin, admin.ModelAdmin):
    list_display = 'slug', 'name', 'parent'


@admin.register(AdministrationUnitCategory)
class AdministrationUnitCategoryAdmin(EditableByAdminOnlyMixin, admin.ModelAdmin):
    pass


@admin.register(MembershipCategory)
class MembershipCategoryAdmin(EditableByAdminOnlyMixin, admin.ModelAdmin):
    pass


@admin.register(EventCategory)
class EventCategoryAdmin(EditableByAdminOnlyMixin, admin.ModelAdmin):
    pass


@admin.register(EventProgramCategory)
class EventProgramCategoryAdmin(EditableByAdminOnlyMixin, admin.ModelAdmin):
    pass
