from django.contrib import admin

from bis.admin_helpers import EditableByAdminOnlyMixin
from categories.models import *


@admin.register(FinanceCategory)
class FinanceCategoryAdmin(EditableByAdminOnlyMixin, admin.ModelAdmin):
    pass


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
    list_display = 'name', 'description', 'parent'
