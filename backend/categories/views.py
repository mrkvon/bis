from rest_framework.viewsets import ReadOnlyModelViewSet

from categories.serializers import *


class GrantCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = GrantCategorySerializer
    queryset = GrantCategory.objects.all()


class EventIntendedForCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = EventIntendedForCategorySerializer
    queryset = EventIntendedForCategory.objects.all()


class DietCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = DietCategorySerializer
    queryset = DietCategory.objects.all()


class QualificationCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = QualificationCategorySerializer
    queryset = QualificationCategory.objects.all()


class AdministrationUnitCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = AdministrationUnitCategorySerializer
    queryset = AdministrationUnitCategory.objects.all()


class MembershipCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = MembershipCategorySerializer
    queryset = MembershipCategory.objects.all()


class EventGroupCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = EventGroupCategorySerializer
    queryset = EventGroupCategory.objects.all()


class EventCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = EventCategorySerializer
    queryset = EventCategory.objects.all()


class EventProgramCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = EventProgramCategorySerializer
    queryset = EventProgramCategory.objects.all()


class DonationSourceCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = DonationSourceCategorySerializer
    queryset = DonationSourceCategory.objects.all()


class OrganizerRoleCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = OrganizerRoleCategorySerializer
    queryset = OrganizerRoleCategory.objects.all()


class TeamRoleCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = TeamRoleCategorySerializer
    queryset = TeamRoleCategory.objects.all()


class OpportunityCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = OpportunityCategorySerializer
    queryset = OpportunityCategory.objects.all()


class LocationProgramCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = LocationProgramCategorySerializer
    queryset = LocationProgramCategory.objects.all()


class LocationAccessibilityCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = LocationAccessibilityCategorySerializer
    queryset = LocationAccessibilityCategory.objects.all()


class RoleCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = RoleCategorySerializer
    queryset = RoleCategory.objects.all()


class HealthInsuranceCompanyViewSet(ReadOnlyModelViewSet):
    serializer_class = HealthInsuranceCompanySerializer
    queryset = HealthInsuranceCompany.objects.all()


class SexCategoryViewSet(ReadOnlyModelViewSet):
    serializer_class = SexCategorySerializer
    queryset = SexCategory.objects.all()
