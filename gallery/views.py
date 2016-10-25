from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets

from .models import *

def index(request):
	return render(request, 'gallery/index.html', {
			'is_logged_in': request.user.is_authenticated(),
		})


# @api_view(['GET'])
# def get_photos(request):
# 	photos = Photo.objects.all()
# 	serializer = PhotoSerializer(photos, many=True)
# 	return Response(serializer.data)


@require_POST
def upload_photos(request):
	return HttpResponse("Upload")


class PhotoViewSet(viewsets.ModelViewSet):
	queryset = Photo.objects.all()
	serializer_class = PhotoSerializer
