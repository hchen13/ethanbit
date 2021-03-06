"""ethanbit URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url, include
from django.contrib import admin
from . import views

urlpatterns = [
    url(r'^$', views.index, name='home'),
    url(r'^admin/', admin.site.urls),

    # apps
    url(r'^gallery/', include('gallery.urls')),
    url(r'^terminal/', include('terminal.urls')),
	url(r'^projects/', include('projects.urls')),
    url(r'^resume/', include('resume.urls')),
    url(r'^playground/', include('playground.urls')),

    # extra url routings
    url(r'^assets/(?P<file_path>.*)', views.get_asset),

    url(r'^login/', views.login_page, name='login_page'),

    # ssl challenge
    url(r'^\.well-known/acme-challenge/NKiD5Pt_k0Cg3NlV1Xngdviq1OwAl8Ul7UdvvsCnP8Q', views.ssl_challenge),
]
