from django.apps import AppConfig


class BISConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'event'
    verbose_name = 'Události'

    def ready(self):
        import event.signals

    class Meta:
        verbose_name_plural = "Události"