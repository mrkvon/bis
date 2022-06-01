from admin_auto_filters.filters import AutocompleteFilterFactory
from django.contrib.auth.models import Group
from django.contrib.gis.admin import OSMGeoAdmin
from django.http import HttpResponseRedirect
from django.urls import reverse
from nested_admin.forms import SortableHiddenMixin
from nested_admin.nested import NestedTabularInline, NestedModelAdmin
from rangefilter.filters import DateRangeFilter
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


class DuplicateUserAdminInline(NestedTabularInline):
    model = DuplicateUser
    fk_name = 'user'
    autocomplete_fields = 'other',
    extra = 0

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(DuplicateUser)
class DuplicateUserAdmin(FilterQuerysetMixin, NestedModelAdmin):
    change_form_template = 'bis/duplicate_user_change_form.html'

    model = DuplicateUser
    list_display = 'user', 'other', 'get_user_info', 'get_other_info'
    raw_id_fields = 'user', 'other'

    list_select_related = 'user__address', 'other__address'

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('user__emails', 'other__emails')

    def get_readonly_fields(self, request, obj=None):
        if obj: return 'get_user_info', 'get_other_info'
        return ()

    def get_info(self, user):
        emails = ", ".join(str(email) for email in user.emails.all())
        return mark_safe(f"{user}<br>Nar: {user.birthday}<br>Adr: {getattr(user, 'address', '')}<br>E-maily: {emails}<br>Tel: {user.phone}")

    @admin.display(description='Primární uživatel')
    def get_user_info(self, obj):
        return self.get_info(obj.user)

    @admin.display(description='Duplicitní uživatel')
    def get_other_info(self, obj):
        return self.get_info(obj.other)

    def response_change(self, request, obj):
        if "_merge_users" in request.POST or "_merge_users_rev" in request.POST:
            if "_merge_users" in request.POST:
                obj.user.merge_with(obj.other)
            else:
                obj.other.merge_with(obj.user)
            return HttpResponseRedirect(reverse('admin:bis_duplicateuser_changelist'))

        return super().response_change(request, obj)

    def render_change_form(self, request, context, obj=None, *args, **kwargs):
        if obj: context['merge_disabled'] = not obj.can_be_merged_by(request.user)
        return super().render_change_form(request, context, obj, *args, **kwargs)


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

    list_display = 'get_name', 'birthday', 'address', 'get_emails', 'phone', 'get_qualifications', 'get_memberships'
    list_filter = ActiveMembershipFilter, \
                  AutocompleteFilterFactory('Člen článku', 'memberships__administration_unit'), \
                  ('memberships__year'), ActiveQualificationFilter, 'qualifications__category', \
                  ('date_joined', DateRangeFilter), ('birthday', DateRangeFilter), \
                  ('participated_in_events__event__start', DateRangeFilter), \
                  ('events_where_was_organizer__start', DateRangeFilter)

    search_fields = 'emails__email', 'phone', 'first_name', 'last_name', 'nickname'
    list_select_related = 'address',

    def get_inlines(self, request, obj):
        if request.user.is_superuser:
            return QualificationAdmin, MembershipAdmin, DuplicateUserAdminInline, UserEmailAdmin
        return QualificationAdmin, MembershipAdmin, DuplicateUserAdminInline

    def get_rangefilter_participated_in_events__event__start_title(self, request, field_path):
        return 'Jeli na akci v období'

    def get_rangefilter_events_where_was_organizer__start_title(self, request, field_path):
        return 'Organizovali akci v období'

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
