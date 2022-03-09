from django.contrib import admin
from django.contrib.auth.models import Group
from django.contrib.gis.admin import OSMGeoAdmin
from rest_framework.authtoken.models import TokenProxy

from bis.models import *

admin.site.unregister(TokenProxy)
admin.site.unregister(Group)


class LocationPhotosAdmin(admin.TabularInline):
    model = LocationPhoto
    readonly_fields = 'photo_tag',


@admin.register(Location)
class LocationAdmin(OSMGeoAdmin):
    inlines = LocationPhotosAdmin,


class MembershipAdmin(admin.TabularInline):
    model = Membership
    extra = 1


class QualificationAdmin(admin.TabularInline):
    model = Qualification


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    readonly_fields = 'is_superuser', 'last_login', 'date_joined', 'email'
    exclude = 'password', 'groups', 'user_permissions'

    fieldsets = (
        (None, {
            'fields': ('first_name', 'last_name', 'nickname', 'email', 'phone', 'birthday')
        }),
        ('Interní data', {
            'fields': ('is_active', 'is_superuser', 'last_login', 'date_joined'),
            'classes': ('collapse',)
        })
    )

    inlines = QualificationAdmin, MembershipAdmin


@admin.register(AdministrativeUnit)
class AdministrativeUnitAdmin(admin.ModelAdmin):
    pass


class EventPropagationImageAdmin(admin.TabularInline):
    model = EventPropagationImage
    readonly_fields = 'image_tag',
    extra = 1


class EventPhotoAdmin(admin.TabularInline):
    model = EventPhoto
    readonly_fields = 'photo_tag',
    extra = 1


@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    inlines = EventPropagationImageAdmin, EventPhotoAdmin

