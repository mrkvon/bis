from os.path import join

import yaml
from django.db.models.query_utils import DeferredAttribute

from project.settings import BASE_DIR

with open(join(BASE_DIR, 'translation', 'translations.yaml'), 'r') as f:
    translations = yaml.safe_load(f)

ignored_attr_names = ['id', 'pk', 'is_superuser', 'last_login', 'password']


def translate_model(model):
    model_translations = translations['models'][model.__name__]
    model._meta.verbose_name = model_translations['name']
    model._meta.verbose_name_plural = model_translations['name_plural']
    for attr_name in dir(model):
        attr = getattr(model, attr_name)
        if not isinstance(attr, DeferredAttribute):
            continue

        if attr_name.endswith('_id'):
            attr_name = attr_name[:-3]

        if attr_name in ignored_attr_names:
            continue

        if not attr_name in model_translations['fields']:
            raise Exception(f'Model {model.__name__} has no translation for attribute {attr_name}')

        value = model_translations['fields'][attr_name]
        if not value:
            continue

        if isinstance(value, str):
            value = [value]

        if isinstance(value, list):
            if len(value) >= 1:
                getattr(model, attr_name).field.verbose_name = value[0]

            if len(value) >= 2:
                getattr(model, attr_name).field.help_text = value[1]

    return model
