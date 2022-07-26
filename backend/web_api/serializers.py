from rest_framework.fields import SerializerMethodField
from rest_framework.relations import SlugRelatedField
from rest_framework.serializers import ModelSerializer

from bis.models import User
from event.models import Event, EventPropagation, EventRegistration
from opportunities.models import Opportunity


class EventPropagationSerializer(ModelSerializer):
    intended_for = SlugRelatedField(slug_field='slug', read_only=True)
    diets = SlugRelatedField(slug_field='slug', read_only=True, many=True)
    images = SlugRelatedField(slug_field='url', read_only=True, many=True)
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
        return instance.contact_name or (instance.contact_person and instance.contact_person.get_name())

    def get_contact_phone(self, instance):
        return instance.contact_phone or (instance.contact_person and instance.contact_person.phone)

    def get_contact_email(self, instance):
        return instance.contact_email or (instance.contact_person and instance.contact_person.emails.first())

    def get_cost(self, instance):
        cost = f"{instance.cost} Kč"
        if instance.discounted_cost is not None:
            cost = f"{instance.discounted_cost}/{cost}"

        return cost


class EventRegistrationSerializer(ModelSerializer):
    class Meta:
        model = EventRegistration

        fields = (
            'is_registration_required',
            'is_event_full',
        )


class EventSerializer(ModelSerializer):
    propagation = EventPropagationSerializer(read_only=True)
    registration = EventRegistrationSerializer(read_only=True)

    location = SlugRelatedField(slug_field='name', read_only=True)
    category = SlugRelatedField(slug_field='slug', read_only=True)
    program = SlugRelatedField(slug_field='slug', read_only=True)
    administration_units = SlugRelatedField(slug_field='abbreviation', read_only=True, many=True)

    class Meta:
        model = Event

        fields = (
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


class UserContactSerializer(ModelSerializer):
    name = SerializerMethodField()

    class Meta:
        model = User

        fields = (
            'name',
            'email',
            'phone',
        )

    def get_name(self, instance):
        return instance.get_name()


class OpportunitySerializer(ModelSerializer):
    category = SlugRelatedField(slug_field='slug', read_only=True)
    location = SlugRelatedField(slug_field='name', read_only=True)
    contact_person = UserContactSerializer(read_only=True)

    class Meta:
        model = Opportunity

        fields = (
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
            'contact_person',
            'image',
        )
