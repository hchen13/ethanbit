from django.conf.urls import url

from . import views

app_name = 'projects'

project_list = views.ProjectViewSet.as_view(actions={
	'get': 'list',
	'post': 'create'
})

urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^projects/', project_list, name='project_list'),
]