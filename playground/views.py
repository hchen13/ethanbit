from django.http.response import HttpResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework import viewsets

from playground.models import Data, DataSerializer

import importlib, os
settings = importlib.import_module(os.environ.get('DJANGO_SETTINGS_MODULE'))


def index(request):
	return render(request, 'playground/index.html')

