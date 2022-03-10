from nested_admin.forms import SortableHiddenMixin
from nested_admin.nested import NestedTabularInline, NestedModelAdmin, NestedStackedInline
from rangefilter.filters import DateRangeFilter

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


class EventPropagationAdmin(NestedStackedInline):
    model = EventPropagation
    inlines = EventPropagationImageAdmin,
    classes = 'collapse',


class EventRegistrationAdmin(NestedStackedInline):
    model = EventRegistration
    classes = 'collapse',
    inlines = QuestionnaireAdmin,


class EventRecordAdmin(NestedStackedInline):
    model = EventRecord
    inlines = EventPhotoAdmin,
    classes = 'collapse',


@admin.register(Event)
class EventAdmin(NestedModelAdmin):
    inlines = EventFinanceAdmin, EventPropagationAdmin, EventRegistrationAdmin, EventRecordAdmin
    save_as = True

    list_filter = 'administrative_unit', \
                  ('start', DateRangeFilter), ('end', DateRangeFilter), \
                  'propagation__is_shown_on_web', 'propagation__intended_for', \
                  'propagation__vip_propagation', \
                  'is_canceled', 'is_internal', \
                  'registration__is_registration_required', 'registration__is_event_full', \
                  'record__has_attendance_list',

    list_display = 'name', 'start', 'location', 'administrative_unit', 'is_canceled'
    list_select_related = 'location', 'administrative_unit'

    date_hierarchy = 'start'
    search_fields = 'name',
