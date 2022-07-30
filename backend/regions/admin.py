from django.contrib.gis.admin import OSMGeoAdmin
from nested_admin.nested import NestedModelAdmin

from bis.admin_permissions import ReadOnlyMixin, EditableByAdminOnlyMixin
from event.models import *
from regions.models import Region, ZipCode


@admin.register(Region)
class RegionAdmin(EditableByAdminOnlyMixin, OSMGeoAdmin):
    pass


@admin.register(ZipCode)
class ZipCodeAdmin(ReadOnlyMixin, NestedModelAdmin):
    list_filter = 'region',
    list_display = 'zip_code', 'region'
    list_select_related = 'region',
    search_fields = 'zip_code',
