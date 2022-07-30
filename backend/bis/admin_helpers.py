from admin_numeric_filter.admin import RangeNumericFilter
from admin_numeric_filter.forms import SliderNumericForm
from django.contrib.admin import ListFilter
from django.urls import reverse
from more_admin_filters import MultiSelectDropdownFilter
from rangefilter.filters import DateRangeFilter

from bis.models import *


def get_admin_edit_url(obj):
    url = reverse(f'admin:{obj._meta.app_label}_{obj._meta.model_name}_change', args=[obj.id])
    return mark_safe(f'<a href="{url}">{obj}</a>')


class YesNoFilter(admin.SimpleListFilter):
    query = None

    def lookups(self, request, model_admin):
        return (
            ('yes', 'Ano'),
            ('no', 'Ne'),
        )

    def queryset(self, request, queryset):
        if self.value() == 'yes':
            queryset = queryset.filter(**self.query)
        if self.value() == 'no':
            queryset = queryset.exclude(**self.query)
        return queryset


class HasDonorFilter(YesNoFilter):
    title = 'Má přiřazeného dárce'
    parameter_name = 'has_donor'
    query = {'donor__isnull': False}


class ActiveQualificationFilter(YesNoFilter):
    title = 'Má aktivní kvalifikaci'
    parameter_name = 'active_qualification'
    query = {'qualifications__valid_till__gte': timezone.now().date()}


class ActiveMembershipFilter(YesNoFilter):
    title = 'Má aktivní členství'
    parameter_name = 'active_membership'
    query = {'memberships__year': timezone.now().year}


class BoardStatusFilter(MultiSelectDropdownFilter):
    template = 'more_admin_filters/multiselectdropdownfilter.html'


class IsChairmanFilter(YesNoFilter):
    title = 'Je předseda'
    parameter_name = 'is_chairman'
    query = {'chairman_of__isnull': False}


class IsViceChairmanFilter(YesNoFilter):
    title = 'Je místopředseda'
    parameter_name = 'is_vice_chairman'
    query = {'vice_chairman_of__isnull': False}


class IsManagerFilter(YesNoFilter):
    title = 'Je hospodář'
    parameter_name = 'is_manager'
    query = {'manager_of__isnull': False}


class IsBoardMemberFilter(YesNoFilter):
    title = 'Je člen představenstva'
    parameter_name = 'administration_units'
    query = {'administration_units__isnull': False}


class IsAdministrationUnitActiveFilter(YesNoFilter):
    title = 'Je článek aktivní'
    parameter_name = 'administration_unit_active'
    query = {'existed_till__isnull': True}


class RawRangeNumericFilter(ListFilter):
    parameter_name = None
    min_value = 0
    max_value = 100
    template = 'admin/filter_numeric_range.html'

    def __init__(self, request, params, model, model_admin):
        super().__init__(request, params, model, model_admin)
        self.request = request

        if self.parameter_name + '_from' in params:
            value = params.pop(self.parameter_name + '_from')
            self.used_parameters[self.parameter_name + '_from'] = value

        if self.parameter_name + '_to' in params:
            value = params.pop(self.parameter_name + '_to')
            self.used_parameters[self.parameter_name + '_to'] = value

    def queryset(self, request, queryset):
        filters = {}

        value_from = self.used_parameters.get(self.parameter_name + '_from', None)
        if value_from is not None and value_from != '':
            filters.update({self.parameter_name + '__gte': value_from})

        value_to = self.used_parameters.get(self.parameter_name + '_to', None)
        if value_to is not None and value_to != '':
            filters.update({self.parameter_name + '__lte': value_to})

        return queryset.filter(**filters)

    def expected_parameters(self):
        return [
            '{}_from'.format(self.parameter_name),
            '{}_to'.format(self.parameter_name),
        ]

    def has_output(self):
        return True

    def choices(self, changelist):
        return ({
                    'decimals': 0,
                    'step': 1,
                    'parameter_name': self.parameter_name,
                    'request': self.request,
                    'min': self.min_value,
                    'max': self.max_value,
                    'value_from': self.used_parameters.get(self.parameter_name + '_from', self.min_value),
                    'value_to': self.used_parameters.get(self.parameter_name + '_to', self.max_value),
                    'form': SliderNumericForm(name=self.parameter_name, data={
                        self.parameter_name + '_from': self.used_parameters.get(self.parameter_name + '_from',
                                                                                self.min_value),
                        self.parameter_name + '_to': self.used_parameters.get(self.parameter_name + '_to',
                                                                              self.max_value),
                    })
                },)


class MembershipsYearFilter(RangeNumericFilter):
    parameter_name = 'memberships__year'


class AgeFilter(RawRangeNumericFilter):
    title = 'Věk'
    parameter_name = 'age'

    def queryset(self, request, queryset):
        filters = {}

        value_from = self.used_parameters.get(self.parameter_name + '_from', None)
        if value_from is not None and value_from != '':
            filters.update({'birthday__lt': now().date() - relativedelta(years=int(value_from))})

        value_to = self.used_parameters.get(self.parameter_name + '_to', None)
        if value_to is not None and value_to != '':
            filters.update({'birthday__gte': now().date() - relativedelta(years=int(value_to) + 1)})

        return queryset.filter(**filters)


class AggDonorsDonation(DateRangeFilter):
    def __init__(self, field, request, params, model, model_admin, field_path):
        field_path = self.custom_field_path
        super().__init__(field, request, params, model, model_admin, field_path)
        self.title = self.custom_title


class FirstDonorsDonation(AggDonorsDonation):
    custom_title = 'Dle prvního daru'
    custom_field_path = 'first_donation'
    annotate_with = {'first_donation': Min('donations__donated_at')}


class LastDonorsDonation(AggDonorsDonation):
    custom_title = 'Dle posledního daru'
    custom_field_path = 'last_donation'
    annotate_with = {'last_donation': Max('donations__donated_at')}

class AnnotateDonationsCount(DateRangeFilter):
    def __init__(self, field, request, params, model, model_admin, field_path):
        field_path = ''
        super().__init__(field, request, params, model, model_admin, field_path)