from django.contrib.auth.models import Group
from django.contrib.gis.admin import OSMGeoAdmin
from nested_admin.forms import SortableHiddenMixin
from nested_admin.nested import NestedTabularInline, NestedModelAdmin
from rest_framework.authtoken.models import TokenProxy

from bis.admin_helpers import ActiveQualificationFilter, ActiveMembershipFilter, FilterQuerysetMixin
from bis.models import *

admin.site.unregister(TokenProxy)
admin.site.unregister(Group)


class BISAdminSite(admin.AdminSite):
    login_template = 'templates/login.html'


class LocationPhotosAdmin(NestedTabularInline):
    model = LocationPhoto
    readonly_fields = 'photo_tag',


@admin.register(Location)
class LocationAdmin(OSMGeoAdmin):
    inlines = LocationPhotosAdmin,
    search_fields = 'name',
    autocomplete_fields = 'patron',

    def has_add_permission(self, request):
        user = request.user
        return user.is_superuser or user.is_office_worker or user.is_board_member

    def has_change_permission(self, request, obj=None):
        return self.has_add_permission(request)

    def has_delete_permission(self, request, obj=None):
        return self.has_add_permission(request)


class MembershipAdmin(NestedTabularInline):
    model = Membership
    extra = 0

    autocomplete_fields = 'administration_unit',

    exclude = '_import_id',

    def has_add_permission(self, request, obj):
        user = request.user
        return user.is_superuser or user.is_office_worker or user.is_board_member

    def has_change_permission(self, request, obj=None):
        return self.has_add_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        return self.has_add_permission(request, obj)


class QualificationAdmin(NestedTabularInline):
    model = Qualification
    fk_name = 'user'
    extra = 0

    autocomplete_fields = 'approved_by',

    exclude = '_import_id',


class UserEmailAdmin(SortableHiddenMixin, NestedTabularInline):
    model = UserEmail
    sortable_field_name = 'order'
    extra = 0


@admin.register(User)
class UserAdmin(FilterQuerysetMixin, NestedModelAdmin):
    readonly_fields = 'is_superuser', 'last_login', 'date_joined', 'get_emails'
    exclude = 'groups', 'user_permissions', 'password', 'is_superuser'

    fieldsets = (
        (None, {
            'fields': ('first_name', 'last_name', 'nickname', 'get_emails', 'phone', 'birthday')
        }),
        ('Interní data', {
            'fields': ('is_active', 'last_login', 'date_joined'),
            'classes': ('collapse',)
        })
    )

    list_display = 'get_name', 'get_emails', 'phone', 'get_qualifications', 'get_memberships'
    list_filter = ActiveQualificationFilter, ActiveMembershipFilter, 'memberships__year'
    search_fields = 'emails__email', 'phone', 'first_name', 'last_name', 'nickname'

    inlines = QualificationAdmin, MembershipAdmin, UserEmailAdmin

    # def get_inlines(self, request, obj):
    #     if request.user.is_superuser:
    #         return
    #     return QualificationAdmin, MembershipAdmin

    def get_readonly_fields(self, request, obj=None):
        if not request.user.is_education_member:
            return super().get_readonly_fields(request, obj)

        result = []
        for fieldset in self.fieldsets:
            for field in fieldset[1]['fields']:
                result.append(field)
        return result

    def has_add_permission(self, request):
        user = request.user
        return user.is_superuser or user.is_office_worker or user.is_board_member

    def has_change_permission(self, request, obj=None):
        user = request.user
        return user.is_superuser or user.is_office_worker or user.is_board_member or user.is_education_member

    def has_delete_permission(self, request, obj=None):
        return self.has_add_permission(request)

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('memberships', 'qualifications', 'emails')
