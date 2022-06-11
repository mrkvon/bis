from django.urls import path, include
from rest_framework import routers

from web_api.views import *

router = routers.DefaultRouter()

router.register('events', EventViewSet, 'events')


urlpatterns = [
    path('', include(router.urls)),
]
