from django.contrib.admin.options import InlineModelAdmin

from administration_units.models import BrontosaurusMovement, AdministrationUnit, AdministrationUnitAddress, \
    AdministrationUnitContactAddress
from bis.models import Qualification, User, UserAddress, UserContactAddress, UserEmail, Location, LocationPhoto, \
    Membership
from donations.models import Donation, UploadBankRecords, VariableSymbol
from event.models import Event
from other.models import Feedback, DuplicateUser
from questionnaire.models import QuestionnaireAnswers, Answer


class PermissionMixin:
    def raise_error(self, method, request):
        raise RuntimeError(f'Uncheck {method} permission for user {request.user}, model {self.model}')

    def can_view_all_objs(self, request):
        return request.user.can_see_all or \
               self.model._meta.app_label in ['categories', 'regions'] or \
               self.model in [BrontosaurusMovement,
                              Location, LocationPhoto,
                              AdministrationUnit, AdministrationUnitAddress, AdministrationUnitContactAddress]

    def is_readonly(self):
        return self.model._meta.app_label in ['categories', 'regions'] or \
               self.model in [QuestionnaireAnswers, Answer, Donation, Feedback]

    def get_queryset(self, request):
        self.request = request
        queryset = super().get_queryset(request)
        if self.can_view_all_objs(request):
            return queryset

        if isinstance(self, InlineModelAdmin):
            return queryset

        if self.model in [BrontosaurusMovement]:
            return queryset

        queryset = self.model.filter_queryset(queryset, request.user)

        ordering = self.get_ordering(request)
        if ordering:
            queryset = queryset.order_by(*ordering)

        return queryset

    def has_view_permission(self, request, obj=None):
        # individual objects are filtered using get_queryset,
        # this is used only for disabling whole admin model
        if self.model in [UploadBankRecords] or (not obj and self.model in [DuplicateUser]):
            return request.user.is_superuser or request.user.is_office_worker

        if self.can_view_all_objs(request) or request.user.is_board_member:
            return True

        if request.user.is_education_member:
            return self.model in [Qualification, User, UserAddress, UserContactAddress, Feedback, DuplicateUser]

        self.raise_error('view', request)

    def has_add_permission(self, request, obj=None):
        if self.model is Feedback: return True
        if self.model is BrontosaurusMovement: return False
        if self.is_readonly(): return False

        if request.user.is_superuser:
            return True

        if request.user.is_office_worker:
            if self.model not in [UserEmail]:
                return True

        if self.model is DuplicateUser and not obj: return False

        if request.user.is_education_member:
            if self.model in [User, Qualification, DuplicateUser, Feedback]:
                return True

        if request.user.is_board_member:
            if self.model in [Location, LocationPhoto, User]:
                return True

            if self.model in [Event, UserAddress, UserContactAddress, DuplicateUser, Membership,
                              AdministrationUnitAddress, AdministrationUnitContactAddress] \
                    or self.model._meta.app_label in ['event', 'questionnaire']:
                return not obj or obj.has_edit_permission(request.user)

        return False

    def has_change_permission(self, request, obj=None):
        if self.model in [VariableSymbol]: return False
        if self.is_readonly(): return False
        if request.user.is_superuser: return True

        if request.user.is_office_worker:
            if self.model not in [BrontosaurusMovement, UserEmail]:
                return True

        if self.model is DuplicateUser and not obj: return False

        if request.user.is_education_member:
            if self.model in [User, Qualification, DuplicateUser]:
                return True

        if request.user.is_board_member:
            if self.model in [Location, User, UserAddress, UserContactAddress, Event, DuplicateUser, Membership,
                              AdministrationUnit, AdministrationUnitAddress, AdministrationUnitContactAddress] \
                    or self.model._meta.app_label in ['event', 'questionnaire']:
                return not obj or obj.has_edit_permission(request.user)

        return False

    def has_delete_permission(self, request, obj=None):
        if self.model in [BrontosaurusMovement, UploadBankRecords]: return False
        if self.is_readonly(): return False
        if request.user.is_superuser: return True

        if request.user.is_office_worker:
            if self.model not in [UserEmail]:
                return True

        if self.model is DuplicateUser and not obj: return False

        if request.user.is_education_member:
            if self.model in [Qualification, DuplicateUser]:
                return True

        if request.user.is_board_member:
            if self.model in [AdministrationUnitContactAddress, DuplicateUser, Membership] \
                    or self.model._meta.app_label in ['event', 'questionnaire']:
                return not obj or obj.has_edit_permission(request.user)

        return False

    def get_extra(self, request, obj=None, **kwargs):
        if self.has_add_permission(request, obj):
            return super().get_extra(request, obj, **kwargs)

        return 0
