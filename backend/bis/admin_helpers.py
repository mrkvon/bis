from django.urls import reverse

from bis.models import *


def get_admin_edit_url(obj):
    url = reverse(f'admin:{obj._meta.app_label}_{obj._meta.model_name}_change', args=[obj.id])
    return mark_safe(f'<a href="{url}">{obj}</a>')


class HasDonorFilter(admin.SimpleListFilter):
    title = 'Má přiřazeného dárce'
    parameter_name = 'has_donor'

    def lookups(self, request, model_admin):
        return (
            ('yes', 'Ano'),
            ('no', 'Ne'),
        )

    def queryset(self, request, queryset):
        query = {'donor__isnull': False}
        if self.value() == 'yes':
            queryset = queryset.filter(**query)
        if self.value() == 'no':
            queryset = queryset.exclude(**query)
        return queryset


class ActiveQualificationFilter(admin.SimpleListFilter):
    title = 'Má aktivní kvalifikaci'
    parameter_name = 'active_qualification'

    def lookups(self, request, model_admin):
        return (
            ('yes', 'Ano'),
            ('no', 'Ne'),
        )

    def queryset(self, request, queryset):
        query = {'qualifications__valid_till__gte': timezone.now().date()}
        if self.value() == 'yes':
            queryset = queryset.filter(**query)
        if self.value() == 'no':
            queryset = queryset.exclude(**query)
        return queryset


class ActiveMembershipFilter(admin.SimpleListFilter):
    title = 'Má aktivní členství'
    parameter_name = 'active_membership'

    def lookups(self, request, model_admin):
        # qs = model_admin.get_queryset(request)
        return (
            ('yes', 'Ano'),
            ('no', 'Ne'),
        )

    def queryset(self, request, queryset):
        query = {'memberships__year': timezone.now().year}
        if self.value() == 'yes':
            queryset = queryset.filter(**query)
        if self.value() == 'no':
            queryset = queryset.exclude(**query)
        return queryset


class ReadOnlyMixin:
    def has_add_permission(self, request, obj=None):
        return False

    def has_change_permission(self, request, obj=None):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


class EditableByAdminOnlyMixin:
    def has_add_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser


class EditableByOfficeMixin:
    def has_add_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_office_worker

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_office_worker

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_office_worker


class EditableByBoardMixin:
    def has_add_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_office_worker or request.user.is_board_member

    def has_change_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_office_worker or request.user.is_board_member

    def has_delete_permission(self, request, obj=None):
        return request.user.is_superuser or request.user.is_office_worker or request.user.is_board_member


class FilterQuerysetMixin:
    def get_queryset(self, request):
        queryset = super().get_queryset(request)
        if request.user.can_see_all:
            return queryset

        queryset = self.model.filter_queryset(queryset, request.user)

        ordering = self.get_ordering(request)
        if ordering:
            queryset = queryset.order_by(*ordering)

        return queryset
