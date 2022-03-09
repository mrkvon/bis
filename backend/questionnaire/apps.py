from django.apps import AppConfig


class CrowdEstateConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'questionnaire'
    verbose_name = 'Questionnaire'

    def ready(self):
        import questionnaire.signals
