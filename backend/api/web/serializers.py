from typing import Optional

from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework.fields import SerializerMethodField
from rest_framework.relations import SlugRelatedField, StringRelatedField
from rest_framework.serializers import ModelSerializer

from administration_units.models import AdministrationUnit
from bis.models import User, Location
from categories.serializers import OpportunityCategorySerializer, EventCategorySerializer, \
    EventProgramCategorySerializer, AdministrationUnitCategorySerializer, LocationAccessibilityCategorySerializer, \
    EventIntendedForCategorySerializer, DietCategorySerializer, EventGroupCategorySerializer
from common.thumbnails import ThumbnailImageFieldFile
from event.models import Event, EventPropagation, EventRegistration
from opportunities.models import Opportunity


class UserSerializer(ModelSerializer):
    name = SerializerMethodField()
    phone = PhoneNumberField()

    class Meta:
        model = User
        fields = (
            'id',
            'name',
            'email',
            'phone',
        )

    def get_name(self, instance) -> str:
        return instance.get_name()


class EventPropagationSerializer(ModelSerializer):
    diets = DietCategorySerializer(many=True)
    images = SerializerMethodField()
    contact_name = SerializerMethodField()
    contact_phone = SerializerMethodField()
    contact_email = SerializerMethodField()

    class Meta:
        model = EventPropagation
        fields = (
            'minimum_age',
            'maximum_age',
            'cost',
            'accommodation',
            'working_days',
            'working_hours',
            'diets',
            'organizers',
            'web_url',
            'invitation_text_introduction',
            'invitation_text_practical_information',
            'invitation_text_work_description',
            'invitation_text_about_us',
            'contact_name',
            'contact_phone',
            'contact_email',
            'images',
        )

    def get_contact_name(self, instance) -> str:
        return instance.contact_name or instance.contact_person and instance.contact_person.get_name()

    def get_contact_phone(self, instance) -> str:
        return str(instance.contact_phone) or instance.contact_person and str(instance.contact_person.phone)

    def get_contact_email(self, instance) -> str:
        return instance.contact_email or instance.contact_person and instance.contact_person.email

    def get_images(self, instance) -> list[ThumbnailImageFieldFile.UrlsType]:
        return [image.image.urls for image in instance.images.all()]


class EventRegistrationSerializer(ModelSerializer):
    class Meta:
        model = EventRegistration

        fields = (
            'is_registration_required',
            'is_event_full',
        )


class LocationSerializer(ModelSerializer):
    patron = UserSerializer()
    program = EventProgramCategorySerializer()
    accessibility_from_prague = LocationAccessibilityCategorySerializer()
    accessibility_from_brno = LocationAccessibilityCategorySerializer()
    region = StringRelatedField()
    photos = SerializerMethodField()

    class Meta:
        model = Location
        fields = (
            'name',
            'description',
            'patron',
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
            'photos',
        )

    def get_photos(self, instance) -> list[ThumbnailImageFieldFile.UrlsType]:
        return [photo.photo.urls for photo in instance.photos.all()]


class EventSerializer(ModelSerializer):
    propagation = EventPropagationSerializer(read_only=True)
    registration = EventRegistrationSerializer(read_only=True)

    location = LocationSerializer()
    group = EventGroupCategorySerializer()
    category = EventCategorySerializer()
    program = EventProgramCategorySerializer()
    intended_for = EventIntendedForCategorySerializer()
    administration_units = SlugRelatedField(slug_field='abbreviation', read_only=True, many=True)

    class Meta:
        model = Event

        fields = (
            'id',
            'name',
            'start',
            'end',
            'duration',
            'location',
            'group',
            'category',
            'program',
            'intended_for',
            'administration_units',
            'propagation',
            'registration',
        )


class OpportunitySerializer(ModelSerializer):
    category = OpportunityCategorySerializer()
    location = LocationSerializer()
    contact_name = SerializerMethodField()
    contact_phone = SerializerMethodField()
    contact_email = SerializerMethodField()

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

    def get_contact_name(self, instance) -> str:
        return instance.contact_name or instance.contact_person and instance.contact_person.get_name()

    def get_contact_phone(self, instance) -> str:
        return str(instance.contact_phone) or instance.contact_person and str(instance.contact_person.phone)

    def get_contact_email(self, instance) -> str:
        return instance.contact_email or instance.contact_person and instance.contact_person.email


class AdministrationUnitSerializer(ModelSerializer):
    phone = PhoneNumberField()
    category = AdministrationUnitCategorySerializer()
    chairman = UserSerializer()
    vice_chairman = UserSerializer()
    manager = UserSerializer()
    board_members = UserSerializer(many=True)
    address = StringRelatedField()
    contact_address = StringRelatedField()

    class Meta:
        model = AdministrationUnit

        fields = (
            'id',
            'name',
            'abbreviation',
            'is_for_kids',
            'phone',
            'email',
            'www',
            'ic',
            'address',
            'contact_address',
            'bank_account_number',
            'existed_since',
            'existed_till',
            'category',
            'chairman',
            'vice_chairman',
            'manager',
            'board_members',
        )
