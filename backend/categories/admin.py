from django.contrib import admin

from categories.models import *


class CategoryBaseAdmin(admin.ModelAdmin):
    def has_add_permission(self, request):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


@admin.register(FinanceCategory)
class FinanceCategoryAdmin(CategoryBaseAdmin):
    pass


@admin.register(GrantCategory)
class GrantCategoryAdmin(CategoryBaseAdmin):
    pass


@admin.register(PropagationIntendedForCategory)
class PropagationIntendedForCategoryAdmin(CategoryBaseAdmin):
    pass


@admin.register(DietCategory)
class DietCategoryAdmin(CategoryBaseAdmin):
    pass


@admin.register(QualificationCategory)
class QualificationCategoryAdmin(CategoryBaseAdmin):
    list_display = 'name', 'description', 'parent'
