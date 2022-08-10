from django.urls import path, include
from rest_framework import routers

from web_api.views import *

router = routers.DefaultRouter()

router.register('events', EventViewSet, 'events')
router.register('opportunities', OpportunityViewSet, 'opportunities')
router.register('administration_units', AdministrationUnitViewSet, 'administration_units')


urlpatterns = [
    path('', include(router.urls)),
]
