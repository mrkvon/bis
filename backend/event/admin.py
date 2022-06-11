from admin_auto_filters.filters import AutocompleteFilterFactory
from nested_admin.forms import SortableHiddenMixin
from nested_admin.nested import NestedTabularInline, NestedModelAdmin, NestedStackedInline
from rangefilter.filters import DateRangeFilter

from bis.admin_helpers import FilterQuerysetMixin
from event.models import *
from questionnaire.admin import QuestionnaireAdmin


class EventPropagationImageAdmin(SortableHiddenMixin, NestedTabularInline):
    model = EventPropagationImage
    sortable_field_name = 'order'
    readonly_fields = 'image_tag',
    extra = 3
    classes = 'collapse',


class EventPhotoAdmin(NestedTabularInline):
    model = EventPhoto
    readonly_fields = 'photo_tag',
    extra = 3
    classes = 'collapse',


class EventFinanceAdmin(NestedStackedInline):
    model = EventFinance
    classes = 'collapse',


class EventVIPPropagationAdmin(NestedStackedInline):
    model = VIPEventPropagation
    classes = 'collapse',


class EventPropagationAdmin(NestedStackedInline):
    model = EventPropagation
    inlines = EventVIPPropagationAdmin, EventPropagationImageAdmin,
    classes = 'collapse',

    autocomplete_fields = 'contact_person',


class EventRegistrationAdmin(NestedStackedInline):
    model = EventRegistration
    classes = 'collapse',
    inlines = QuestionnaireAdmin,


class EventRecordAdmin(NestedStackedInline):
    model = EventRecord
    inlines = EventPhotoAdmin,
    classes = 'collapse',

    autocomplete_fields = 'participants',


@admin.register(Event)
class EventAdmin(FilterQuerysetMixin, NestedModelAdmin):
    inlines = EventFinanceAdmin, EventPropagationAdmin, EventRegistrationAdmin, EventRecordAdmin
    save_as = True
    filter_horizontal = 'other_organizers',

    list_filter = AutocompleteFilterFactory('Článek', 'administration_unit'), \
                  ('start', DateRangeFilter), ('end', DateRangeFilter), \
                  'category', 'program', \
                  'propagation__is_shown_on_web', 'propagation__intended_for', \
                  'is_canceled', 'is_internal', \
                  'registration__is_registration_required', 'registration__is_event_full', \
                  'record__has_attendance_list',

    list_display = 'name', 'get_date', 'location', 'administration_unit', 'is_canceled'
    list_select_related = 'location', 'administration_unit'

    date_hierarchy = 'start'
    search_fields = 'name',
    readonly_fields = 'duration',

    autocomplete_fields = 'main_organizer', 'other_organizers', 'location', 'administration_unit',

    exclude = '_import_id',

    def has_add_permission(self, request):
        user = request.user
        return user.is_superuser or user.is_office_worker or user.is_board_member

    def has_change_permission(self, request, obj=None):
        user = request.user
        return user.is_superuser or user.is_office_worker or user.is_board_member

    def has_delete_permission(self, request, obj=None):
        return self.has_change_permission(request, obj)
