from django.conf.urls import url, include

from . import views
from . import programs

app_name = 'terminal'
urlpatterns = [
	url(r'^$', views.index, name='index'),
	url(r'^run_app', programs.entry, name='entry'),
	url(r'^check_login', views.check_login, name='check_login'),
]