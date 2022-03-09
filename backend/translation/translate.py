from os.path import join

import yaml

from project.settings import BASE_DIR

with open(join(BASE_DIR, 'translation', 'translations.yaml'), 'r') as f:
    translations = yaml.safe_load(f)


def translate_model(model):
    model_translations = translations['models'][model._meta.model.__name__]
    model._meta.verbose_name = model_translations['name']
    model._meta.verbose_name_plural = model_translations['name_plural']
    if 'fields' in model_translations:
        for key, value in model_translations['fields'].items():
            if not value:
                continue

            if isinstance(value, str):
                value = [value]

            if isinstance(value, list):
                if len(value) >= 1:
                    getattr(model, key).field.verbose_name = value[0]

                if len(value) >= 2:
                    getattr(model, key).field.help_text = value[1]

    return model
