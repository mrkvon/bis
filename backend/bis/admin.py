from django.contrib.auth.models import Group
from django.contrib.gis.admin import OSMGeoAdmin
from rest_framework.authtoken.models import TokenProxy

from bis.admin_helpers import ActiveQualificationFilter, ActiveMembershipFilter
from bis.models import *

admin.site.unregister(TokenProxy)
admin.site.unregister(Group)


class LocationPhotosAdmin(admin.TabularInline):
    model = LocationPhoto
    readonly_fields = 'photo_tag',


@admin.register(Location)
class LocationAdmin(OSMGeoAdmin):
    inlines = LocationPhotosAdmin,
    search_fields = 'name',


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

    list_display = 'get_name', 'email', 'phone', 'get_qualification', 'get_membership'
    list_filter = ActiveQualificationFilter, ActiveMembershipFilter, 'memberships__year'
    list_select_related = 'qualification',
    search_fields = 'email', 'phone', 'first_name', 'last_name', 'nickname'


@admin.register(AdministrativeUnit)
class AdministrativeUnitAdmin(admin.ModelAdmin):
    list_display = 'name', 'parent'
    search_fields = 'name',
