from django.contrib import admin
from django.urls import path, include
from allauth.account.views import confirm_email as allauthemailconfirmation
from django.conf.urls import url

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('dashboard.urls')),
    url(r'^api/rest-auth/', include('rest_auth.urls')),
    url(r'^api/rest-auth/registration/', include('rest_auth.registration.urls')),
    url(r'^api/account/', include('allauth.urls')),
]
