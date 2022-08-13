from phonenumber_field.serializerfields import PhoneNumberField
from rest_framework.fields import SerializerMethodField
from rest_framework.relations import SlugRelatedField, StringRelatedField
from rest_framework.serializers import ModelSerializer

from administration_units.models import AdministrationUnit
from bis.models import User, Location
from categories.models import PropagationIntendedForCategory, EventProgramCategory, LocationAccessibility, \
    EventCategory, OpportunityCategory, AdministrationUnitCategory
from common.serializers import make_serializer
from event.models import Event, EventPropagation, EventRegistration
from opportunities.models import Opportunity


class UserSerializer(ModelSerializer):
    name = SerializerMethodField()
    phone = PhoneNumberField()
    email = SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'name',
            'email',
            'phone',
        )

    def get_name(self, instance):
        return instance.get_name()

    def get_email(self, instance):
        return getattr(instance.emails.first(), 'email', None)


class EventPropagationSerializer(ModelSerializer):
    intended_for = make_serializer(PropagationIntendedForCategory)()
    diets = make_serializer(PropagationIntendedForCategory)(many=True)
    images = SerializerMethodField()
    contact_name = SerializerMethodField()
    contact_phone = SerializerMethodField()
    contact_email = SerializerMethodField()
    cost = SerializerMethodField()

    class Meta:
        model = EventPropagation
        fields = (
            'minimum_age',
            'maximum_age',
            'cost',
            'intended_for',
            'accommodation',
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

    def get_contact_name(self, instance):
        return instance.contact_name or instance.contact_person and instance.contact_person.get_name()

    def get_contact_phone(self, instance):
        return str(instance.contact_phone) or instance.contact_person and str(instance.contact_person.phone)

    def get_contact_email(self, instance):
        return instance.contact_email or \
               instance.contact_person and getattr(instance.contact_person.emails.first(), 'email', None)

    def get_cost(self, instance):
        if not instance.cost:
            return None
        cost = f"{instance.cost} Kč"
        if instance.discounted_cost is not None:
            cost = f"{instance.discounted_cost}/{cost}"

        return cost

    def get_images(self, instance):
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
    program = make_serializer(EventProgramCategory)()
    accessibility_from_prague = make_serializer(LocationAccessibility)()
    accessibility_from_brno = make_serializer(LocationAccessibility)()
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

    def get_photos(self, instance):
        return [photo.photo.urls for photo in instance.photos.all()]


class EventSerializer(ModelSerializer):
    propagation = EventPropagationSerializer(read_only=True)
    registration = EventRegistrationSerializer(read_only=True)

    location = LocationSerializer()
    category = make_serializer(EventCategory)()
    program = make_serializer(EventProgramCategory)()
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
            'category',
            'program',
            'administration_units',
            'propagation',
            'registration',
        )


class OpportunitySerializer(ModelSerializer):
    category = make_serializer(OpportunityCategory)()
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

    def get_contact_name(self, instance):
        return instance.contact_name or instance.contact_person and instance.contact_person.get_name()

    def get_contact_phone(self, instance):
        return str(instance.contact_phone) or instance.contact_person and str(instance.contact_person.phone)

    def get_contact_email(self, instance):
        return instance.contact_email or \
               instance.contact_person and getattr(instance.contact_person.emails.first(), 'email', None)


class AdministrationUnitSerializer(ModelSerializer):
    phone = PhoneNumberField()
    category = make_serializer(AdministrationUnitCategory)()
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
