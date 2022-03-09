from django.urls import path, include
from rest_framework import routers

from categories import views
from categories.models import *
from categories.serializers import *
from categories.views import *

router = routers.DefaultRouter()


urlpatterns = [
    path('', include(router.urls)),
    # path('get_email_status/', views.get_email_status),
    # path('login/', views.login),
]
