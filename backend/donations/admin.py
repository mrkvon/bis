from django.contrib.messages import INFO, ERROR
from django.http import HttpResponseRedirect
from django.urls import reverse
from nested_admin.nested import NestedModelAdmin, NestedTabularInline
from solo.admin import SingletonModelAdmin

from bis.admin_helpers import EditableByAdminOnlyMixin, HasDonorFilter
from donations.helpers import upload_bank_records
from donations.models import UploadBankRecords, Donor, Donation, VariableSymbol
from event.models import *


@admin.register(Donation)
class DonationAdmin(NestedModelAdmin):
    autocomplete_fields = 'donor',
    list_display = '__str__', 'donor', 'donated_at', 'donation_source', 'info'
    list_filter = HasDonorFilter, 'donation_source',
    exclude = '_import_id', '_variable_symbol'

    list_select_related = 'donor__user', 'donation_source'

    def has_add_permission(self, request): return False

    def has_change_permission(self, request, obj=None): return False

    def has_delete_permission(self, request, obj=None):
        return obj and not obj.donor


class DonationAdminInline(NestedTabularInline):
    model = Donation

    def has_add_permission(self, request, obj): return False

    def has_change_permission(self, request, obj=None): return False

    def has_delete_permission(self, request, obj=None): return False


class VariableSymbolInline(NestedTabularInline):
    model = VariableSymbol
    extra = 0

    def has_change_permission(self, request, obj=None): return False


@admin.register(Donor)
class DonorAdmin(NestedModelAdmin):
    list_display = 'user', 'subscribed_to_newsletter', 'is_public', 'regional_center_support', 'basic_section_support', 'date_joined'
    readonly_fields = 'user',
    list_select_related = 'user', 'regional_center_support', 'basic_section_support'
    inlines = VariableSymbolInline, DonationAdminInline,
    search_fields = 'user__emails__email', 'user__phone', 'user__first_name', 'user__last_name', 'user__nickname',

    autocomplete_fields = 'regional_center_support', 'basic_section_support'

    def save_formset(self, request, form, formset, change):
        if formset.model is Donation:
            formset.new_objects = []
            formset.changed_objects = []
            formset.deleted_objects = []
            return
        super().save_formset(request, form, formset, change)


@admin.register(UploadBankRecords)
class UploadBankRecordsAdmin(EditableByAdminOnlyMixin, SingletonModelAdmin):

    def save_model(self, request, obj, form, change):
        try:
            upload_bank_records(obj.file.file)
            self.message_user(request, "Záznamy úspěšně nahrány", INFO)
        except AssertionError as e:
            self.message_user(request, str(e), ERROR)

    def response_change(self, request, obj):
        return HttpResponseRedirect(reverse('admin:donations_uploadbankrecords_changelist'))

    def render_change_form(self, request, context, add=False, change=False, form_url='', obj=None):
        context['show_save_and_continue'] = False
        context['show_save_and_add_another'] = False
        context['show_delete'] = False
        return super().render_change_form(request, context, add, change, form_url, obj)
