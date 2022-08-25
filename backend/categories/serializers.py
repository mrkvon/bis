from rest_framework.serializers import ModelSerializer

from categories.models import *


class GrantCategorySerializer(ModelSerializer):
    class Meta:
        model = GrantCategory
        exclude = ()


class PropagationIntendedForCategorySerializer(ModelSerializer):
    class Meta:
        model = PropagationIntendedForCategory
        exclude = ()


class DietCategorySerializer(ModelSerializer):
    class Meta:
        model = DietCategory
        exclude = ()


class QualificationCategorySerializer(ModelSerializer):
    class Meta:
        model = QualificationCategory
        exclude = ()


class AdministrationUnitCategorySerializer(ModelSerializer):
    class Meta:
        model = AdministrationUnitCategory
        exclude = ()


class MembershipCategorySerializer(ModelSerializer):
    class Meta:
        model = MembershipCategory
        exclude = ()


class EventCategorySerializer(ModelSerializer):
    class Meta:
        model = EventCategory
        exclude = ()


class EventProgramCategorySerializer(ModelSerializer):
    class Meta:
        model = EventProgramCategory
        exclude = ()


class DonationSourceCategorySerializer(ModelSerializer):
    class Meta:
        model = DonationSourceCategory
        exclude = ()


class OrganizerRoleCategorySerializer(ModelSerializer):
    class Meta:
        model = OrganizerRoleCategory
        exclude = ()


class TeamRoleCategorySerializer(ModelSerializer):
    class Meta:
        model = TeamRoleCategory
        exclude = ()


class OpportunityCategorySerializer(ModelSerializer):
    class Meta:
        model = OpportunityCategory
        exclude = ()


class LocationProgramSerializer(ModelSerializer):
    class Meta:
        model = LocationProgram
        exclude = ()


class LocationAccessibilitySerializer(ModelSerializer):
    class Meta:
        model = LocationAccessibility
        exclude = ()


class RoleCategorySerializer(ModelSerializer):
    class Meta:
        model = RoleCategory
        exclude = ()


class HealthInsuranceCompanySerializer(ModelSerializer):
    class Meta:
        model = HealthInsuranceCompany
        exclude = ()


class SexCategorySerializer(ModelSerializer):
    class Meta:
        model = SexCategory
        exclude = ()
