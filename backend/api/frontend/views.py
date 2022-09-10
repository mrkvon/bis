from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet

from api.frontend.permissions import BISPermissions
from api.frontend.serializers import UserSerializer, EventSerializer, LocationSerializer, OpportunitySerializer, \
    FinanceReceiptSerializer, EventPhotoSerializer, EventPropagationImageSerializer, QuestionSerializer
from bis.models import User, Location
from bis.permissions import Permissions
from event.models import Event, EventFinanceReceipt, EventPhoto, EventPropagationImage
from opportunities.models import Opportunity
from questionnaire.models import Question


class PermissionViewSetBase(ModelViewSet):
    lookup_field = 'id'
    permission_classes = [IsAuthenticated, BISPermissions]

    def get_queryset(self):
        queryset = super(PermissionViewSetBase, self).get_queryset()
        perms = Permissions(self.request.user, self.serializer_class.Meta.model)
        return perms.filter_queryset(queryset)


class UserViewSet(PermissionViewSetBase):
    serializer_class = UserSerializer
    queryset = User.objects.select_related(
        'close_person',
        'offers',
        'address',
        'contact_address',
        'donor',
    ).prefetch_related(
        'all_emails',
        'donor__donations',
        'donor__variable_symbols',
        'memberships',
        'qualifications',
        'qualifications__approved_by',
    )


class EventViewSet(PermissionViewSetBase):
    serializer_class = EventSerializer
    queryset = Event.objects.select_related(
        'finance',
        'propagation',
        'propagation__vip_propagation',
        'registration',
        'registration__questionnaire',
        'record',
    )


class LocationViewSet(PermissionViewSetBase):
    serializer_class = LocationSerializer
    queryset = Location.objects.all()


class OpportunityViewSet(PermissionViewSetBase):
    serializer_class = OpportunitySerializer
    queryset = Opportunity.objects.all()

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
