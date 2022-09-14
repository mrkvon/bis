from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from rest_framework.viewsets import ModelViewSet

from api.frontend.filters import EventFilter, LocationFilter, UserFilter
from api.frontend.permissions import BISPermissions
from api.frontend.serializers import UserSerializer, EventSerializer, LocationSerializer, OpportunitySerializer, \
    FinanceReceiptSerializer, EventPhotoSerializer, EventPropagationImageSerializer, QuestionSerializer
from bis.models import User, Location
from bis.permissions import Permissions
from event.models import Event, EventFinanceReceipt, EventPhoto, EventPropagationImage
from opportunities.models import Opportunity
from questionnaire.models import Question

safe_http_methods = [m.lower() for m in SAFE_METHODS]


class PermissionViewSetBase(ModelViewSet):
    lookup_field = 'id'
    permission_classes = [IsAuthenticated, BISPermissions]

    def get_queryset(self):
        queryset = super(PermissionViewSetBase, self).get_queryset()
        perms = Permissions(self.request.user, self.serializer_class.Meta.model)
        return perms.filter_queryset(queryset)


class UserViewSet(PermissionViewSetBase):
    serializer_class = UserSerializer
    filterset_class = UserFilter
    queryset = User.objects.select_related(
        'close_person',
        'offers',
        'address',
        'address__region',
        'contact_address',
        'contact_address__region',
        'donor',
        'donor__donation_source',
        'health_insurance_company',
        'sex',
    ).prefetch_related(
        'offers__programs',
        'offers__organizer_roles',
        'offers__team_roles',
        'all_emails',
        'donor__donations',
        'donor__variable_symbols',
        'memberships',
        'memberships__category',
        'qualifications',
        'qualifications__category',
        'qualifications__approved_by',
        'roles',
    )


class ParticipantsViewSet(UserViewSet):
    http_method_names = safe_http_methods

    def get_queryset(self):
        return super().get_queryset().filter(participated_in_events__event=self.kwargs['event_id'])


class RegisteredViewSet(UserViewSet):
    http_method_names = safe_http_methods

    def get_queryset(self):
        return super().get_queryset().filter(filled_questionnaires__questionnaire__event__registration__event=self.kwargs['event_id'])


class OrganizersViewSet(UserViewSet):
    http_method_names = safe_http_methods

    def get_queryset(self):
        return super().get_queryset().filter(events_where_was_organizer=self.kwargs['event_id'])


class EventViewSet(PermissionViewSetBase):
    serializer_class = EventSerializer
    filterset_class = EventFilter
    queryset = Event.objects.select_related(
        'finance',
        'finance__grant_category',
        'propagation',
        'propagation__intended_for',
        'propagation__vip_propagation',
        'registration',
        'registration__questionnaire',
        'record',
        'category',
        'program',
    ).prefetch_related(
        'propagation__diets',
    )


class ParticipatedInViewSet(EventViewSet):
    http_method_names = safe_http_methods

    def get_queryset(self):
        return super().get_queryset().filter(record__participants=self.kwargs['user_id'])


class RegisteredInViewSet(EventViewSet):
    http_method_names = safe_http_methods

    def get_queryset(self):
        return super().get_queryset().filter(registration__questionnaire__answers__user=self.kwargs['user_id'])


class WhereWasOrganizerViewSet(EventViewSet):
    http_method_names = safe_http_methods

    def get_queryset(self):
        return super().get_queryset().filter(other_organizers=self.kwargs['user_id'])


class LocationViewSet(PermissionViewSetBase):
    serializer_class = LocationSerializer
    filterset_class = LocationFilter
    queryset = Location.objects.select_related(
        'patron',
        'close_person',
        'region',
        'program',
        'accessibility_from_prague',
        'accessibility_from_brno',
    )


class OpportunityViewSet(PermissionViewSetBase):
    serializer_class = OpportunitySerializer
    queryset = Opportunity.objects.select_related(
        'category',
    )

    def get_queryset(self):
        return super().get_queryset().filter(contact_person=self.kwargs['user_id'])


class FinanceReceiptViewSet(PermissionViewSetBase):
    serializer_class = FinanceReceiptSerializer
    queryset = EventFinanceReceipt.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(finance__event=self.kwargs['event_id'])


class EventPropagationImageViewSet(PermissionViewSetBase):
    serializer_class = EventPropagationImageSerializer
    queryset = EventPropagationImage.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(propagation__event=self.kwargs['event_id'])


class EventPhotoViewSet(PermissionViewSetBase):
    serializer_class = EventPhotoSerializer
    queryset = EventPhoto.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(record__event=self.kwargs['event_id'])


class QuestionViewSet(PermissionViewSetBase):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()

    def get_queryset(self):
        return super().get_queryset().filter(questionnaire__event_registration__event=self.kwargs['event_id'])
