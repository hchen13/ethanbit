from __future__ import unicode_literals

from django.db import models
from django.utils.encoding import python_2_unicode_compatible
from rest_framework import serializers


@python_2_unicode_compatible
class Project(models.Model):

	name = models.CharField(max_length=25)
	intro = models.TextField()
	image = models.ImageField(upload_to='projects/', blank=True)
	link = models.CharField(max_length=80, blank=True, default='')

	def __str__(self):
		return self.name


class ProjectSerializer(serializers.ModelSerializer):
	class Meta:
		model = Project
		fields = '__all__'