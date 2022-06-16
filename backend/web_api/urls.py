from django.urls import path, include
from rest_framework import routers

from web_api.views import *

router = routers.DefaultRouter()

router.register('events', EventViewSet, 'events')
router.register('opportunities', OpportunityViewSet, 'opportunities')


urlpatterns = [
    path('', include(router.urls)),
]
