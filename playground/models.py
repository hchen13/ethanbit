from __future__ import unicode_literals

from django.db import models
from rest_framework import serializers


class Data(models.Model):
	source = models.FileField(upload_to='playground')
	upload_date = models.DateField(auto_now_add=True)

	def __str__(self):
		return self.source.name


class DataSerializer(serializers.ModelSerializer):
	class Meta:
		model = Data
		fields = '__all__'
