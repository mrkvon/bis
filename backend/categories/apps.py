from django.apps import AppConfig


class CrowdEstateConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'categories'
    verbose_name = 'Categories'

    def ready(self):
        import categories.signals
