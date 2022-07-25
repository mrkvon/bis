from admin_auto_filters.filters import AutocompleteFilterFactory
from django.core.exceptions import ValidationError
from more_admin_filters import MultiSelectRelatedDropdownFilter
from nested_admin.forms import SortableHiddenMixin
from nested_admin.nested import NestedTabularInline, NestedModelAdmin, NestedStackedInline
from rangefilter.filters import DateRangeFilter

from bis.admin_helpers import FilterQuerysetMixin, EditableByBoardMixin
from event.models import *
from questionnaire.admin import QuestionnaireAdmin


class EventPropagationImageAdmin(SortableHiddenMixin, NestedTabularInline):
    model = EventPropagationImage
    sortable_field_name = 'order'
    readonly_fields = 'image_tag',
    extra = 3
    classes = 'collapse',

    def get_formset(self, request, obj=None, **kwargs):
        formset = super().get_formset(request, obj, **kwargs)

        if '_saveasnew' not in request.POST:
            return formset

        id = request.resolver_match.kwargs['object_id']
        event = Event.objects.get(id=id)

        if not hasattr(event, 'propagation'):
            return formset

        images = event.propagation.images.all()

        class New(formset):
            def is_valid(_self):
                for i, form in enumerate(_self):
                    if i >= len(images):
                        continue

                    form.instance.image = images[i].image
                    form.fields['image'].required = False

                return super(New, _self).is_valid()

        return New


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
class EventAdmin(EditableByBoardMixin, FilterQuerysetMixin, NestedModelAdmin):
    inlines = EventFinanceAdmin, EventPropagationAdmin, EventRegistrationAdmin, EventRecordAdmin
    save_as = True
    filter_horizontal = 'other_organizers',

    list_filter = AutocompleteFilterFactory('Článek', 'administration_units'), \
                  ('start', DateRangeFilter), ('end', DateRangeFilter), \
                  ('category', MultiSelectRelatedDropdownFilter), ('program', MultiSelectRelatedDropdownFilter), \
                  'propagation__is_shown_on_web', ('propagation__intended_for', MultiSelectRelatedDropdownFilter), \
                  'is_canceled', 'is_internal', \
                  'registration__is_registration_required', 'registration__is_event_full', \
                  'is_attendance_list_required', \
                  ('location__region', MultiSelectRelatedDropdownFilter)

    list_display = 'name', 'get_date', 'location', 'get_administration_units', 'is_canceled'
    list_select_related = 'location',

    @admin.display(description='Administrativní jednotky')
    def get_administration_units(self, obj):
        return mark_safe('<br>'.join([str(au) for au in obj.administration_units.all()]))

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related('administration_units')

    date_hierarchy = 'start'
    search_fields = 'name',
    readonly_fields = 'duration',

    autocomplete_fields = 'main_organizer', 'other_organizers', 'location', 'administration_units',

    exclude = '_import_id',

    def get_form(self, request, obj=None, change=False, **kwargs):
        form = super(EventAdmin, self).get_form(request, obj, change, **kwargs)
        user = request.user

        class F1(form):
            def clean(_self):
                super().clean()
                if not user.is_superuser and not user.is_office_worker:
                    if not any([
                        any([au in user.administration_units.all() for au in _self.cleaned_data.get('administration_units', [])]),
                        _self.cleaned_data.get('main_organizer') == user,
                        user in _self.cleaned_data.get('other_organizers', []).all(),
                    ]):
                        raise ValidationError('Akci musíš vytvořit pod svým článkem nebo '
                                                  'musíš být v organizátorském týmu')

                return _self.cleaned_data

        if '_saveasnew' not in request.POST:
            return F1

        id = request.resolver_match.kwargs['object_id']
        event = Event.objects.get(id=id)

        class F2(F1):
            def clean(_self):
                super().clean()
                start = _self.cleaned_data['start']
                end = _self.cleaned_data['end']

                if start == event.start or end == event.end:
                    raise ValidationError("Nová událost musí mít odlišný čas začátku a konce od původní události")

                return _self.cleaned_data

        return F2