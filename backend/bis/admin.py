from admin_numeric_filter.admin import NumericFilterModelAdmin
from django.contrib.auth.models import Group
from django.contrib.gis.admin import OSMGeoAdmin
from more_admin_filters import MultiSelectRelatedDropdownFilter
from nested_admin.forms import SortableHiddenMixin
from nested_admin.nested import NestedTabularInline, NestedStackedInline, NestedModelAdminMixin
from rangefilter.filters import DateRangeFilter
from rest_framework.authtoken.models import TokenProxy

from bis.admin_filters import AgeFilter, NoBirthdayFilter, MainOrganizerOfEventRangeFilter, \
    OrganizerOfEventRangeFilter, ParticipatedInEventRangeFilter, MainOrganizerOfEventOfAdministrationUnitFilter, \
    OrganizerOfEventOfAdministrationUnitFilter, ParticipatedInEventOfAdministrationUnitFilter, MemberDuringYearsFilter, \
    MemberOfAdministrationUnitFilter, QualificationCategoryFilter, QualificationValidAtFilter, UserStatsDateFilter
from bis.admin_helpers import list_filter_extra_title
from bis.admin_permissions import PermissionMixin
from bis.models import *
from opportunities.models import OfferedHelp
from other.models import DuplicateUser
from xlsx_export.export import export_to_xlsx

admin.site.unregister(TokenProxy)
admin.site.unregister(Group)


class LocationPhotosAdmin(PermissionMixin, NestedTabularInline):
    model = LocationPhoto
    readonly_fields = 'photo_tag',


class LocationContactPersonAdmin(PermissionMixin, NestedTabularInline):
    model = LocationContactPerson


class LocationPatronAdmin(PermissionMixin, NestedTabularInline):
    model = LocationPatron


@admin.register(Location)
class LocationAdmin(PermissionMixin, OSMGeoAdmin):
    inlines = LocationContactPersonAdmin, LocationPatronAdmin, LocationPhotosAdmin,
    search_fields = 'name',
    exclude = '_import_id',

    list_filter = 'program', 'for_beginners', 'is_full', 'is_unexplored', \
                  ('accessibility_from_prague', MultiSelectRelatedDropdownFilter), \
                  ('accessibility_from_brno', MultiSelectRelatedDropdownFilter), \
                  ('region', MultiSelectRelatedDropdownFilter)


class MembershipAdmin(PermissionMixin, NestedTabularInline):
    model = Membership
    extra = 0

    autocomplete_fields = 'administration_unit',

    exclude = '_import_id',


class QualificationAdmin(PermissionMixin, NestedTabularInline):
    model = Qualification
    fk_name = 'user'
    extra = 0

    autocomplete_fields = 'approved_by',

    exclude = '_import_id',


class UserEmailAdmin(PermissionMixin, SortableHiddenMixin, NestedTabularInline):
    model = UserEmail
    sortable_field_name = 'order'
    extra = 0


class DuplicateUserAdminInline(PermissionMixin, NestedTabularInline):
    model = DuplicateUser
    fk_name = 'user'
    autocomplete_fields = 'other',
    extra = 0


class ClosePersonAdmin(PermissionMixin, NestedTabularInline):
    model = UserClosePerson


class UserAddressAdmin(PermissionMixin, NestedTabularInline):
    model = UserAddress


class UserContactAddressAdmin(PermissionMixin, NestedTabularInline):
    model = UserContactAddress


class UserOfferedHelpAdmin(PermissionMixin, NestedStackedInline):
    model = OfferedHelp


@admin.action(description='Označ vybrané jako muže')
def mark_as_man(self, request, queryset):
    queryset.update(sex=SexCategory.objects.get(slug='man'))


@admin.action(description='Označ vybrané jako ženy')
def mark_as_woman(self, request, queryset):
    queryset.update(sex=SexCategory.objects.get(slug='woman'))


@admin.register(User)
class UserAdmin(PermissionMixin, NestedModelAdminMixin, NumericFilterModelAdmin):
    actions = [export_to_xlsx, mark_as_woman, mark_as_man]
    readonly_fields = 'is_superuser', 'last_login', 'date_joined', 'get_all_emails', \
                      'get_events_where_was_organizer', 'get_participated_in_events', \
                      'roles'
    exclude = 'groups', 'user_permissions', 'password', 'is_superuser', '_str'

    fieldsets = (
        (None, {
            'fields': ('first_name', 'last_name', 'nickname', 'get_all_emails', 'phone', 'birthday', 'sex')
        }),
        ('Osobní informace', {
            'fields': ('health_insurance_company', 'health_issues')
        }),
        ('Události', {
            'fields': ('get_events_where_was_organizer', 'get_participated_in_events')
        }),
        ('Interní data', {
            'fields': ('roles', 'is_active', 'last_login', 'date_joined'),
            'classes': ('collapse',)
        })
    )

    list_display = 'get_name', 'birthday', 'address', 'get_email', 'phone', 'get_qualifications', 'get_memberships', \
                   'get_programs', 'get_organizer_roles', 'get_team_roles',

    list_filter = [
        AgeFilter,

        list_filter_extra_title('Účast na akcích'),
        ('events_where_was_as_main_organizer__start', MainOrganizerOfEventRangeFilter),
        MainOrganizerOfEventOfAdministrationUnitFilter,
        ('events_where_was_organizer__start', OrganizerOfEventRangeFilter),
        OrganizerOfEventOfAdministrationUnitFilter,
        ('participated_in_events__event__start', ParticipatedInEventRangeFilter),
        ParticipatedInEventOfAdministrationUnitFilter,

        list_filter_extra_title('Členství'),
        ('memberships__year', MemberDuringYearsFilter),
        MemberOfAdministrationUnitFilter,

        list_filter_extra_title('Nabízená pomoc'),
        ('offers__programs', MultiSelectRelatedDropdownFilter),
        ('offers__organizer_roles', MultiSelectRelatedDropdownFilter),
        ('offers__team_roles', MultiSelectRelatedDropdownFilter),

        list_filter_extra_title('Kvalifikace'),
        ('qualifications__valid_since', QualificationValidAtFilter),
        ('qualifications__category', QualificationCategoryFilter),

        list_filter_extra_title('Osobní info'),
        ('birthday', DateRangeFilter),
        NoBirthdayFilter,
        ('sex', MultiSelectRelatedDropdownFilter),
        ('address__region', MultiSelectRelatedDropdownFilter),
        ('health_insurance_company', MultiSelectRelatedDropdownFilter),

        list_filter_extra_title('Ostatní'),
        ('roles', MultiSelectRelatedDropdownFilter),
        ('date_joined', DateRangeFilter),
        ('chairman_of__existed_since', UserStatsDateFilter),
    ]

    search_fields = 'all_emails__email', 'phone', 'first_name', 'last_name', 'nickname'
    list_select_related = 'address', 'contact_address'

    def get_inlines(self, request, obj):
        inlines = [UserAddressAdmin, UserContactAddressAdmin,
                   ClosePersonAdmin,
                   UserOfferedHelpAdmin,
                   QualificationAdmin, MembershipAdmin,
                   DuplicateUserAdminInline]
        if request.user.is_superuser:
            inlines.append(UserEmailAdmin)
        return inlines

    def get_rangefilter_participated_in_events__event__start_title(self, request, field_path):
        return 'Jeli na akci v období'

    def get_rangefilter_events_where_was_organizer__start_title(self, request, field_path):
        return 'Organizovali akci v období'

    def get_rangefilter_events_where_was_as_main_organizer__start_title(self, request, field_path):
        return 'Vedli akci v období'

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related(
            'memberships__administration_unit', 'qualifications__category',
            'events_where_was_organizer', 'participated_in_events__event',
            'offers__programs', 'offers__organizer_roles', 'offers__team_roles'
        )

    @admin.display(description='Nabízené programy')
    def get_programs(self, obj):
        return mark_safe('<br>'.join([str(item) for item in obj.offers.programs.all()]))

    @admin.display(description='Nabízené organizátorské role')
    def get_organizer_roles(self, obj):
        return mark_safe('<br>'.join([str(item) for item in obj.offers.organizer_roles.all()]))

    @admin.display(description='Nabízené týmové role')
    def get_team_roles(self, obj):
        return mark_safe('<br>'.join([str(item) for item in obj.offers.team_roles.all()]))
