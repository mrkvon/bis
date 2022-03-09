from django.urls import path, include
from rest_framework import routers

from questionnaire import views
from questionnaire.models import *
from questionnaire.serializers import *
from questionnaire.views import *

router = routers.DefaultRouter()


urlpatterns = [
    path('', include(router.urls)),
    # path('get_email_status/', views.get_email_status),
    # path('login/', views.login),
]
