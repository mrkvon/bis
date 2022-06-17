from django.contrib import admin
from django.utils.safestring import mark_safe


class MyAdminSite(admin.AdminSite):
    site_title = 'BIS'
    site_header = mark_safe(
        '<img src="/backend_static/logo/br_white_right.png" style="height: 60px; margin: -5px 0px -5px -35px">'
        'BIS administrace')
    index_title = 'Ať žije nový BIS!'
    site_url = 'https://brontosaurus.cz/'

    def get_app_list(self, request):
        list = super().get_app_list(request)

        order = [
            'administration_units',
            'bis',
            'opportunities',
            'donations',
            'other',
            'categories',
        ]
        list.sort(key=lambda value: order.index(value['app_label']))
        return list
