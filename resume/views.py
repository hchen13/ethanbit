import importlib
import os

from django.http import HttpResponse
settings = importlib.import_module(os.environ.get('DJANGO_SETTINGS_MODULE'))

pwd = os.path.dirname(__file__)


def pdf_view(request):
	with open(os.path.join(pwd, 'assets', settings.RESUME_FILE), 'r') as pdf:
		response = HttpResponse(pdf.read(), content_type='application/pdf')
		response['Content-Disposition'] = 'inline;filename=resume.pdf'
		return response
