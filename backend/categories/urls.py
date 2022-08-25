from django.urls import path, include
from rest_framework import routers

from bis.helpers import to_snake_case
from categories.views import *

router = routers.DefaultRouter()


def register(viewset):
    model_name = viewset.serializer_class.Meta.model.__name__
    model_name = to_snake_case(model_name)
    if model_name.endswith('y'):
        model_name = model_name[:-1] + 'ies'

    router.register(model_name, viewset, model_name)


register(GrantCategoryViewSet)
register(PropagationIntendedForCategoryViewSet)
register(DietCategoryViewSet)
register(QualificationCategoryViewSet)
register(AdministrationUnitCategoryViewSet)
register(MembershipCategoryViewSet)
register(EventCategoryViewSet)
register(EventProgramCategoryViewSet)
register(DonationSourceCategoryViewSet)
register(OrganizerRoleCategoryViewSet)
register(TeamRoleCategoryViewSet)
register(OpportunityCategoryViewSet)
register(LocationProgramCategoryViewSet)
register(LocationAccessibilityCategoryViewSet)
register(RoleCategoryViewSet)
register(HealthInsuranceCompanyViewSet)
register(SexCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
