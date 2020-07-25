from django.contrib import admin
from django.urls import path, include
from dashboard import views

urlpatterns = [
    path('populateBrand/', views.populateBrand),
    path('populateL1/', views.populateL1),
    path('populateL2/', views.populateL2),
    path('populateL3/', views.populateL3),
    path('populateResult/', views.populateResult),
    path('priceHistory/', views.priceHistory),
    path('priceTrendHistory/', views.priceTrendHistory),
    path('populatePriceDrop/', views.populatePriceDrop),
]
