from django.urls import path, include
from rest_framework import routers

from bis import views
from bis.models import *
from bis.serializers import *
from bis.views import *

router = routers.DefaultRouter()


urlpatterns = [
    path('', include(router.urls)),
    # path('get_email_status/', views.get_email_status),
    # path('login/', views.login),
]
