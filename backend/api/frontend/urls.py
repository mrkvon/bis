from django.urls import path, include
from rest_framework_nested import routers

from api.frontend.views import UserViewSet, EventViewSet, LocationViewSet, OpportunityViewSet, FinanceReceiptViewSet, \
    EventPropagationImageViewSet, EventPhotoViewSet, QuestionViewSet

router = routers.DefaultRouter()

router.register('users', UserViewSet, 'users')
router.register('events', EventViewSet, 'events')
router.register('locations', LocationViewSet, 'locations')

user_router = routers.NestedDefaultRouter(router, 'users', lookup='user')
user_router.register('opportunities', OpportunityViewSet, 'opportunities')

event_finance_router = routers.NestedDefaultRouter(router, 'events', lookup='event')
event_finance_router.register('finance/receipts', FinanceReceiptViewSet)

event_propagation_router = routers.NestedDefaultRouter(router, 'events', lookup='event')
event_propagation_router.register('propagation/images', EventPropagationImageViewSet)

event_record_router = routers.NestedDefaultRouter(router, 'events', lookup='event')
event_record_router.register('record/photos', EventPhotoViewSet)

questionnaire_router = routers.NestedDefaultRouter(router, 'events', lookup='event')
questionnaire_router.register('registration/questionnaire/questions', QuestionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('', include(user_router.urls)),
    path('', include(event_finance_router.urls)),
    path('', include(event_propagation_router.urls)),
    path('', include(event_record_router.urls)),
    path('', include(questionnaire_router.urls)),
]
