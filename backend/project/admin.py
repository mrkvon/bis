from django.contrib import admin

class MyAdminSite(admin.AdminSite):
    site_title = 'BIS'
    site_header = 'BIS administrace'
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

