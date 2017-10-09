from base import *

DEBUG = True


# Database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        # 'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        'NAME': 'ethanbit',
        'USER': 'root',
	    'PASSWORD': 'root',
	    'HOST': 'localhost',
	    'PORT': 3306,
    }
}


# Project specific configurations

DEV_PROJECT_APPS = [
    'playground.apps.PlaygroundConfig',
]

PROJECT_MIDDLEWARE = [
]

INSTALLED_APPS = PREREQ_APPS + PROJECT_APPS + DEV_PROJECT_APPS
MIDDLEWARE = PREREQ_MIDDLEWARE + PROJECT_MIDDLEWARE


# Static files

STATICFILES_DIRS = [
	os.path.join(BASE_DIR, 'static'),
]


# Media files (user-generated files)

MEDIA_ROOT = '/Users/divestar/Pictures/ethanbit_assets/'

