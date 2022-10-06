from drf_spectacular.utils import extend_schema, OpenApiResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND, HTTP_200_OK, HTTP_429_TOO_MANY_REQUESTS
from rest_framework.viewsets import ModelViewSet

from api.frontend.filters import EventFilter, LocationFilter, UserFilter
from api.frontend.permissions import BISPermissions
from api.frontend.serializers import UserSerializer, EventSerializer, LocationSerializer, OpportunitySerializer, \
    FinanceReceiptSerializer, EventPhotoSerializer, EventPropagationImageSerializer, QuestionSerializer, \
    EventApplicationSerializer, GetUnknownUserRequestSerializer, EventDraftSerializer
from api.helpers import parse_request_data
from bis.models import User, Location
from bis.permissions import Permissions
from event.models import Event, EventFinanceReceipt, EventPhoto, EventPropagationImage, EventDraft
from login_code.models import ThrottleLog
from opportunities.models import Opportunity
from questionnaire.models import Question, EventApplication

safe_http_methods = [m.lower() for m in SAFE_METHODS]


class PermissionViewSetBase(ModelViewSet):
    lookup_field = 'id'
    permission_classes = [IsAuthenticated, BISPermissions]

    def get_queryset(self):
        queryset = super(PermissionViewSetBase, self).get_queryset()
        perms = Permissions(self.request.user, self.serializer_class.Meta.model)
        return perms.filter_queryset(queryset)


class UserViewSet(PermissionViewSetBase):
    search_fields = 'all_emails__email', 'phone', 'first_name', 'last_name', 'nickname'
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
        'health_insurance_company',
        'sex',
    ).prefetch_related(
        'offers__programs',
        'offers__organizer_roles',
        'offers__team_roles',
        'all_emails',
        'donor__donations',
        'donor__donations__donation_source',
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
        return super().get_queryset().filter(applications__event_registration__event=self.kwargs['event_id'])


class OrganizersViewSet(UserViewSet):
    http_method_names = safe_http_methods

    def get_queryset(self):
        return super().get_queryset().filter(events_where_was_organizer=self.kwargs['event_id'])


class EventViewSet(PermissionViewSetBase):
    search_fields = 'name',
    serializer_class = EventSerializer
    filterset_class = EventFilter
    queryset = Event.objects.select_related(
        'finance',
        'finance__grant_category',
        'propagation',
        'intended_for',
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
        return super().get_queryset().filter(registration__applications__user=self.kwargs['user_id'])


class WhereWasOrganizerViewSet(EventViewSet):
    http_method_names = safe_http_methods

    def get_queryset(self):
        return super().get_queryset().filter(other_organizers=self.kwargs['user_id'])


class EventDraftViewSet(PermissionViewSetBase):
    serializer_class = EventDraftSerializer
    queryset = EventDraft.objects.all()


class LocationViewSet(PermissionViewSetBase):
    search_fields = 'name', 'description'
    serializer_class = LocationSerializer
    filterset_class = LocationFilter
    queryset = Location.objects.select_related(
        'patron',
        'contact_person',
        'region',
        'program',
        'accessibility_from_prague',
        'accessibility_from_brno',
    )


class OpportunityViewSet(PermissionViewSetBase):
    search_fields = 'name', 'introduction'
    serializer_class = OpportunitySerializer
    queryset = Opportunity.objects.select_related('category')

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


class EventApplicationViewSet(PermissionViewSetBase):
    serializer_class = EventApplicationSerializer
    queryset = EventApplication.objects.select_related('close_person', 'address', 'sex')

    def get_queryset(self):
        return super().get_queryset().filter(event_registration__event=self.kwargs['event_id'])


@extend_schema(request=GetUnknownUserRequestSerializer,
               responses={
                   HTTP_200_OK: UserSerializer,
                   HTTP_404_NOT_FOUND: OpenApiResponse(description='Not found'),
                   HTTP_429_TOO_MANY_REQUESTS: OpenApiResponse(description='Too many requests for first_name + '
                                                                           'last_name, try again in one day'),
               })
@api_view(['post'])
@permission_classes([IsAuthenticated])
@parse_request_data(GetUnknownUserRequestSerializer)
def get_unknown_user(request, data):
    key = f"{data['first_name']}_{data['last_name']}_{request.user.id}"
    ThrottleLog.check_throttled('get_unknown_user', key, 3, 24)
    user = User.objects.filter(**data).first()

    if not user:
        raise NotFound()

    return Response(UserSerializer(instance=user, context={'request': request}).data)
