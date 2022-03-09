try:
    from project.global_settings import *
except ImportError:
    pass

from glob import glob
from os import environ
from os.path import join, dirname, abspath

import sentry_sdk
import yaml
from sentry_sdk.integrations.django import DjangoIntegration

BASE_DIR = dirname(dirname(abspath(__file__)))


def load_environment_variables_from_docker_compose_file():
    try:
        with open(join(dirname(BASE_DIR), 'docker-compose/.dev.yaml'), 'r') as stream:
            content = yaml.safe_load(stream)
            for key, value in content['services']['backend']['environment'].items():
                if key not in environ:
                    environ[key] = str(value)

    except FileNotFoundError:
        print("Environment file not found (that is expected, when using docker-compose)")


load_environment_variables_from_docker_compose_file()

SECRET_KEY = environ['SECRET_KEY']

DEBUG = bool(int(environ['DEBUG']))
TEST = bool(int(environ['TEST']))

FULL_HOSTNAME = environ['FULL_HOSTNAME']
ALLOWED_HOSTS = environ['ALLOWED_HOSTS'].split(',')

# linux
# sudo apt-get install binutils libproj-dev gdal-bin
# mac
# brew install postgresql
# brew install postgis
# brew install gdal
# brew install libgeoip
try:
    GDAL_LIBRARY_PATH = glob('/usr/lib/libgdal.so.*')[0]
    GEOS_LIBRARY_PATH = glob('/usr/lib/libgeos_c.so.*')[0]
except IndexError:
    pass

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework_gis',
    'rest_framework.authtoken',
    'phonenumber_field',
    'corsheaders',
    'bis',
    'categories',
    'questionnaire',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'project.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'project.wsgi.application'

# Database
# https://docs.djangoproject.com/en/2.1/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.contrib.gis.db.backends.postgis',
        'HOST': environ['DB_HOST'],
        'PORT': environ['DB_PORT'],
        'NAME': environ['DB_NAME'],
        'USER': environ['DB_USERNAME'],
        'PASSWORD': environ['DB_PASSWORD'],
    }
}

DEFAULT_AUTO_FIELD = 'django.db.models.AutoField'

#
# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# Internationalization
# https://docs.djangoproject.com/en/2.1/topics/i18n/

LANGUAGE_CODE = 'cs'
TIME_ZONE = 'Europe/Prague'
USE_I18N = True
USE_L10N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.1/howto/static-files/

STATIC_URL = '/backend_static/'
MEDIA_URL = '/media/'

STATIC_ROOT = join(BASE_DIR, 'backend_static')
MEDIA_ROOT = join(BASE_DIR, 'media')

#
# Upload limits
# https://docs.djangoproject.com/en/3.0/ref/settings/#std:setting-DATA_UPLOAD_MAX_MEMORY_SIZE
DATA_UPLOAD_MAX_MEMORY_SIZE = 20 * 1024 * 1024
FILE_UPLOAD_MAX_MEMORY_SIZE = DATA_UPLOAD_MAX_MEMORY_SIZE

#
REST_FRAMEWORK = {
    'DEFAULT_FILTER_BACKENDS': [
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ],
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 20,
}
TOKEN_EXPIRE_AFTER_INACTIVITY_SECONDS = 20 * 60

# API settings
API_BASE = environ['API_BASE']
CORS_URLS_REGEX = r'^/client/' + API_BASE + '.*$'
CORS_ALLOW_ALL_ORIGINS = True

# phonenumber_field
PHONENUMBER_DEFAULT_REGION = 'CZ'
PHONENUMBER_DEFAULT_FORMAT = 'INTERNATIONAL'

# sentry.io logging
if not DEBUG:
    sentry_sdk.init(
        dsn=environ['SENTRY_DSN'],
        integrations=[DjangoIntegration()],

        # Set traces_sample_rate to 1.0 to capture 100%
        # of transactions for performance monitoring.
        # We recommend adjusting this value in production.
        traces_sample_rate=0.0,

        # If you wish to associate users to errors (assuming you are using
        # django.contrib.auth) you may enable sending PII data.
        send_default_pii=True
    )

# app
APP_NAME = environ['APP_NAME']

EMAIL = environ['EMAIL']

AUTH_USER_MODEL = 'bis.User'
