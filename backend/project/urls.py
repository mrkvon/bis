from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from bis.views import LoginView, CodeView

urlpatterns = [
    # custom authentication
    path('admin/login/', LoginView.as_view()),
    path('enter_code/', CodeView.as_view(), name='code'),

    path('admin/', admin.site.urls),
    path(f'', include('rest_framework.urls')),
    path(f'_nested_admin/', include('nested_admin.urls')),
    path('tinymce/', include('tinymce.urls')),

    path(f'{settings.API_BASE}web/', include('web_api.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += [path('__debug__/', include('debug_toolbar.urls'))]
