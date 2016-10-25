from django.conf.urls import url

from gallery.views import *

app_name = 'gallery'

photo_list = PhotoViewSet.as_view(actions={
	'get': 'list',
	'post': 'create'
})

urlpatterns = [
	url(r'^$', index, name='index'),
	url(r'^images/', photo_list, name='photo_list'),
]
