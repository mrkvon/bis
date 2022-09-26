from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import models
from django.db import transaction
from rest_framework.exceptions import ValidationError
from rest_framework.fields import SerializerMethodField
from rest_framework.permissions import SAFE_METHODS
from rest_framework.relations import SlugRelatedField
from rest_framework.serializers import ModelSerializer as DRFModelSerializer
from rest_framework.utils import model_meta

from api.helpers import Base64ImageField, Base64FileField
from bis.models import User, Location, UserAddress, UserContactAddress, Membership, Qualification, UserClosePerson, \
    LocationContactPerson, LocationPatron
from categories.serializers import DonationSourceCategorySerializer, EventProgramCategorySerializer, \
    OrganizerRoleCategorySerializer, TeamRoleCategorySerializer, MembershipCategorySerializer, \
    QualificationCategorySerializer, HealthInsuranceCompanySerializer, SexCategorySerializer, RoleCategorySerializer, \
    GrantCategorySerializer, PropagationIntendedForCategorySerializer, DietCategorySerializer, EventCategorySerializer, \
    LocationProgramCategorySerializer, LocationAccessibilityCategorySerializer, OpportunityCategorySerializer, \
    EventGroupCategorySerializer
from donations.models import Donor, Donation
from event.models import Event, EventFinance, EventPropagation, EventRegistration, EventRecord, EventFinanceReceipt, \
    EventPropagationImage, EventPhoto, VIPEventPropagation
from opportunities.models import Opportunity, OfferedHelp
from questionnaire.models import Questionnaire, Question, EventApplication, EventApplicationClosePerson, \
    EventApplicationAddress
from regions.serializers import RegionSerializer


class ModelSerializer(DRFModelSerializer):
    serializer_field_mapping = DRFModelSerializer.serializer_field_mapping
    serializer_field_mapping[models.ImageField] = Base64ImageField
    serializer_field_mapping[models.FileField] = Base64FileField

    def save(self, **kwargs):
        try:
            return super().save(**kwargs)
        except DjangoValidationError as e:
            raise ValidationError(e.messages)

    @property
    def m2m_fields(self):
        info = model_meta.get_field_info(self.Meta.model)
        return [field_name for field_name, relation_info in info.relations.items() if relation_info.to_many]

    @property
    def nested_serializers(self):
        return {
            field_name: (type(field), self.Meta.model._meta.get_field(field_name).remote_field.name)
            for field_name, field in self.fields.items()
            if isinstance(field, ModelSerializer)
        }

    def get_excluded_fields(self, fields):
        return []

    def _exclude_fields(self, fields):
        for field in self.get_excluded_fields(fields):
            if field in fields:
                del fields[field]

        return fields

    def to_representation(self, instance):
        return self._exclude_fields(super().to_representation(instance))

    def to_internal_value(self, data):
        return self._exclude_fields(super().to_internal_value(data))

    @staticmethod
    def is_serializer_with_id(field):
        return isinstance(field, DRFModelSerializer) and 'id' in field.get_fields()

    def get_fields(self):
        fields = super().get_fields()

        # replace serializers with id field with default PrimaryKeyRelatedField
        if 'request' in self.context and self.context['request'].method not in SAFE_METHODS:
            _declared_fields, self._declared_fields = self._declared_fields, []
            self._declared_fields = {key: field for
                                     key, field in _declared_fields.items()
                                     if not self.is_serializer_with_id(field)}
            without_id_serializers = super().get_fields()
            self._declared_fields = _declared_fields

            for field_name, field in list(fields.items()):
                if self.is_serializer_with_id(field):
                    fields[field_name] = without_id_serializers[field_name]

        return fields

    @staticmethod
    def extract_fields(data, fields):
        return {field: data.pop(field) for field in fields if field in data}

    @transaction.atomic
    def create(self, validated_data):
        m2m_fields = self.extract_fields(validated_data, self.m2m_fields)
        nested_serializers = self.extract_fields(validated_data, self.nested_serializers.keys())

        instance = self.Meta.model.objects.create(**validated_data)

        for field, value in nested_serializers.items():
            if value is None:
                continue

            serializer_class, reverse_field = self.nested_serializers[field]
            serializer = serializer_class(data=self.initial_data[field], context=self.context)
            serializer.is_valid(raise_exception=True)
            serializer.save(**{reverse_field: instance})

        for field, value in m2m_fields.items():
            getattr(instance, field).set(value)

        return instance

    @transaction.atomic
    def update(self, instance, validated_data):
        m2m_fields = self.extract_fields(validated_data, self.m2m_fields)
        nested_serializers = self.extract_fields(validated_data, self.nested_serializers.keys())

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        for field, value in nested_serializers.items():
            serializer_class, reverse_field = self.nested_serializers[field]
            nested_instance = getattr(instance, field, None)

            if value is None:
                if nested_instance is not None:
                    nested_instance.delete()
                continue

            serializer = serializer_class(instance=nested_instance, data=self.initial_data[field], context=self.context)
            serializer.is_valid(raise_exception=True)
            serializer.save(**{reverse_field: instance})

        for attr, value in m2m_fields.items():
            getattr(instance, attr).set(value)

        return instance


class BaseAddressSerializer(ModelSerializer):
    region = RegionSerializer()

    class Meta:
        fields = (
            'street',
            'city',
            'zip_code',
            'region',
        )
        read_only_fields = 'region',


class BaseContactSerializer(ModelSerializer):
    class Meta:
        fields = (
            'first_name',
            'last_name',
            'email',
            'phone',
        )


class DonationSerializer(ModelSerializer):
    donation_source = DonationSourceCategorySerializer()

    class Meta:
        model = Donation
        fields = (
            'donated_at',
            'amount',
            'donation_source',
        )


class DonorSerializer(ModelSerializer):
    variable_symbols = SlugRelatedField(slug_field='variable_symbol', read_only=True, many=True)
    donations = DonationSerializer(many=True, read_only=True)

    class Meta:
        model = Donor
        fields = (
            'subscribed_to_newsletter',
            'is_public',
            'date_joined',
            'regional_center_support',
            'basic_section_support',
            'variable_symbols',
            'donations',
        )
        read_only_fields = 'id', 'date_joined'


class OfferedHelpSerializer(ModelSerializer):
    programs = EventProgramCategorySerializer(many=True)
    organizer_roles = OrganizerRoleCategorySerializer(many=True)
    team_roles = TeamRoleCategorySerializer(many=True)

    class Meta:
        model = OfferedHelp
        fields = (
            'programs',
            'organizer_roles',
            'additional_organizer_role',
            'team_roles',
            'additional_team_role',
            'info',
        )


class UserAddressSerializer(BaseAddressSerializer):
    class Meta(BaseAddressSerializer.Meta):
        model = UserAddress


class UserContactAddressSerializer(BaseAddressSerializer):
    class Meta(BaseAddressSerializer.Meta):
        model = UserContactAddress


class MembershipSerializer(ModelSerializer):
    category = MembershipCategorySerializer()

    class Meta:
        model = Membership
        fields = (
            'category',
            'administration_unit',
            'year',
        )


class QualificationApprovedBySerializer(BaseContactSerializer):
    class Meta(BaseContactSerializer.Meta):
        model = User


class QualificationSerializer(ModelSerializer):
    approved_by = QualificationApprovedBySerializer()

    category = QualificationCategorySerializer()

    class Meta:
        model = Qualification
        fields = (
            'category',
            'valid_since',
            'valid_till',
            'approved_by',
        )


class ClosePersonSerializer(BaseContactSerializer):
    class Meta(BaseContactSerializer.Meta):
        model = UserClosePerson


class UserSerializer(ModelSerializer):
    all_emails = SlugRelatedField(slug_field='email', many=True, read_only=True)
    close_person = ClosePersonSerializer(allow_null=True)
    donor = DonorSerializer(allow_null=True)
    offers = OfferedHelpSerializer(allow_null=True)
    address = UserAddressSerializer()
    contact_address = UserContactAddressSerializer(allow_null=True)
    memberships = MembershipSerializer(many=True, read_only=True)
    qualifications = QualificationSerializer(many=True, read_only=True)
    display_name = SerializerMethodField()

    health_insurance_company = HealthInsuranceCompanySerializer()
    sex = SexCategorySerializer()
    roles = RoleCategorySerializer(many=True)

    class Meta:
        model = User
        fields = (
            'id',
            'first_name',
            'last_name',
            'nickname',
            'display_name',
            'phone',
            'email',
            'all_emails',
            'birthday',
            'close_person',
            'health_insurance_company',
            'health_issues',
            'sex',
            'is_active',
            'date_joined',
            'roles',
            'donor',
            'offers',
            'address',
            'contact_address',
            'memberships',
            'qualifications',
        )
        read_only_fields = 'date_joined', 'is_active', 'roles'

    def get_excluded_fields(self, fields):
        if self.context['request'].user.id != fields.get('id'):
            return ['donor']

        return []

    def get_display_name(self, instance) -> str:
        return str(instance)


class FinanceSerializer(ModelSerializer):
    grant_category = GrantCategorySerializer()

    class Meta:
        model = EventFinance
        fields = (
            'bank_account_number',
            'grant_category',
            'grant_amount',
            'total_event_cost',
            'budget',
            'receipts',
        )


class VIPPropagationSerializer(ModelSerializer):
    class Meta:
        model = VIPEventPropagation
        fields = (
            'goals_of_event',
            'program',
            'short_invitation_text',
            'rover_propagation',
        )


class PropagationSerializer(ModelSerializer):
    vip_propagation = VIPPropagationSerializer(allow_null=True)

    intended_for = PropagationIntendedForCategorySerializer()
    diets = DietCategorySerializer(many=True)

    class Meta:
        model = EventPropagation
        fields = (
            'is_shown_on_web',
            'minimum_age',
            'maximum_age',
            'cost',
            'discounted_cost',
            'intended_for',
            'accommodation',
            'working_hours',
            'working_days',
            'diets',
            'organizers',
            'web_url',
            '_contact_url',
            'invitation_text_introduction',
            'invitation_text_practical_information',
            'invitation_text_work_description',
            'invitation_text_about_us',
            'contact_person',
            'contact_name',
            'contact_phone',
            'contact_email',
            'vip_propagation',
        )


class QuestionnaireSerializer(ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = (
            'introduction',
            'after_submit_text',
        )


class RegistrationSerializer(ModelSerializer):
    questionnaire = QuestionnaireSerializer(allow_null=True)

    class Meta:
        model = EventRegistration
        fields = (
            'is_registration_required',
            'is_event_full',
            'questionnaire',
        )


class RecordSerializer(ModelSerializer):
    class Meta:
        model = EventRecord
        fields = (
            'total_hours_worked',
            'comment_on_work_done',
            'attendance_list',
            'participants',
            'number_of_participants',
            'number_of_participants_under_26',
        )


class EventSerializer(ModelSerializer):
    finance = FinanceSerializer(allow_null=True)
    propagation = PropagationSerializer(allow_null=True)
    registration = RegistrationSerializer(allow_null=True)
    record = RecordSerializer(allow_null=True)

    group = EventGroupCategorySerializer()
    category = EventCategorySerializer()
    program = EventProgramCategorySerializer()

    class Meta:
        model = Event
        fields = (
            'id',
            'name',
            'is_canceled',
            'start',
            'end',
            'number_of_sub_events',
            'location',
            'online_link',
            'group',
            'category',
            'program',
            'administration_units',
            'main_organizer',
            'other_organizers',
            'is_attendance_list_required',
            'is_internal',
            'internal_note',
            'duration',
            'finance',
            'propagation',
            'registration',
            'record',
        )
        read_only_fields = ['duration']

    def get_excluded_fields(self, fields):
        if self.context['request'].user.is_member_only:
            return ['internal_note', 'finance', 'record']

        return []


class LocationContactPersonSerializer(BaseContactSerializer):
    class Meta(BaseContactSerializer.Meta):
        model = LocationContactPerson


class LocationPatronSerializer(BaseContactSerializer):
    class Meta(BaseContactSerializer.Meta):
        model = LocationPatron


class LocationSerializer(ModelSerializer):
    patron = LocationPatronSerializer()
    contact_person = LocationContactPersonSerializer()

    program = LocationProgramCategorySerializer()
    accessibility_from_prague = LocationAccessibilityCategorySerializer()
    accessibility_from_brno = LocationAccessibilityCategorySerializer()
    region = RegionSerializer()

    class Meta:
        model = Location
        fields = (
            'id',
            'name',
            'description',
            'patron',
            'contact_person',
            'for_beginners',
            'is_full',
            'is_unexplored',
            'program',
            'accessibility_from_prague',
            'accessibility_from_brno',
            'volunteering_work',
            'volunteering_work_done',
            'volunteering_work_goals',
            'options_around',
            'facilities',
            'web',
            'address',
            'gps_location',
            'region',
        )


class OpportunitySerializer(ModelSerializer):
    category = OpportunityCategorySerializer()

    class Meta:
        model = Opportunity
        fields = (
            'id',
            'category',
            'name',
            'start',
            'end',
            'on_web_start',
            'on_web_end',
            'location',
            'introduction',
            'description',
            'location_benefits',
            'personal_benefits',
            'requirements',
            'contact_name',
            'contact_phone',
            'contact_email',
            'image',
        )

    def create(self, validated_data):
        validated_data['contact_person'] = User.objects.get(id=self.context['view'].kwargs['user_id'])
        assert validated_data['contact_person'] == self.context['request'].user
        return super().create(validated_data)


class FinanceReceiptSerializer(ModelSerializer):
    class Meta:
        model = EventFinanceReceipt
        fields = (
            'id',
            'receipt',
        )

    def create(self, validated_data):
        validated_data['finance'] = Event.objects.get(id=self.context['view'].kwargs['event_id']).finance
        return super().create(validated_data)


class EventPropagationImageSerializer(ModelSerializer):
    class Meta:
        model = EventPropagationImage
        fields = (
            'id',
            'order',
            'image',
        )

    def create(self, validated_data):
        validated_data['propagation'] = Event.objects.get(id=self.context['view'].kwargs['event_id']).propagation
        return super().create(validated_data)


class EventPhotoSerializer(ModelSerializer):
    class Meta:
        model = EventPhoto
        fields = (
            'id',
            'photo',
        )

    def create(self, validated_data):
        validated_data['record'] = Event.objects.get(id=self.context['view'].kwargs['event_id']).record
        return super().create(validated_data)


class QuestionSerializer(ModelSerializer):
    class Meta:
        model = Question
        fields = (
            'id',
            'question',
            'is_required',
            'order',
        )

    def create(self, validated_data):
        validated_data['questionnaire'] = \
            Event.objects.get(id=self.context['view'].kwargs['event_id']).registration.questionnaire
        return super().create(validated_data)


class EventApplicationClosePersonSerializer(BaseContactSerializer):
    class Meta(BaseContactSerializer.Meta):
        model = EventApplicationClosePerson


class EventApplicationAddressSerializer(BaseAddressSerializer):
    class Meta(BaseAddressSerializer.Meta):
        model = EventApplicationAddress


class EventApplicationSerializer(ModelSerializer):
    close_person = EventApplicationClosePersonSerializer()
    address = EventApplicationAddressSerializer()

    sex = SexCategorySerializer()

    class Meta:
        model = EventApplication
        fields = (
            'id',
            'user',
            'first_name',
            'last_name',
            'nickname',
            'phone',
            'email',
            'birthday',
            'health_issues',
            'sex',
            'created_at',
            'close_person',
            'address',
        )

    def create(self, validated_data):
        validated_data['event_registration'] = \
            Event.objects.get(id=self.context['view'].kwargs['event_id']).registration
        return super().create(validated_data)
