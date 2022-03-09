from django.contrib import admin

from categories.models import *


@admin.register(FinanceCategory)
class FinanceCategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(GrantCategory)
class GrantCategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(PropagationIntendedForCategory)
class PropagationIntendedForCategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(DietCategory)
class DietCategoryAdmin(admin.ModelAdmin):
    pass


@admin.register(QualificationCategory)
class QualificationCategoryAdmin(admin.ModelAdmin):
    pass
