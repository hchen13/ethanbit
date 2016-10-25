from django.shortcuts import render
from rest_framework import viewsets

from .models import *

def index(request):
	return render(request, 'projects/index.html')


class ProjectViewSet(viewsets.ModelViewSet):
	queryset = Project.objects.all()
	serializer_class = ProjectSerializer