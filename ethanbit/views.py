import os

from PIL import Image
from django.http import HttpResponse
from django.http.response import HttpResponseNotFound

from django.shortcuts import render
from django.views.decorators.http import require_GET

import importlib
settings = importlib.import_module(os.environ.get('DJANGO_SETTINGS_MODULE'))


def index(request):
	return render(request, 'ethanbit/index.html')


@require_GET
def get_asset(request, file_path):
	params = request.GET
	path = os.path.join(settings.MEDIA_ROOT, file_path)

	size = 'raw'
	if 'size' in params and params['size'] in settings.IMAGE_SIZES:
		size = params['size']

	try:
		img = Image.open(path)
	except IOError:
		return HttpResponseNotFound('Image not found')

	if size != 'raw':
		img.thumbnail(settings.IMAGE_SIZES[size])

	response = HttpResponse(content_type='image/jpeg')
	img.save(response, 'jpeg')
	return response
