from __future__ import unicode_literals

from django.db import models
from rest_framework import serializers

class Photo(models.Model):
	source = models.ImageField(upload_to='gallery')

	def __str__(self):
		return self.source.name


class PhotoSerializer(serializers.ModelSerializer):
	class Meta:
		model = Photo
