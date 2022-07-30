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
