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
    path('top10/', views.top10),
    path('worst10/', views.worst10),
    path('populateLCH/', views.populateLCH),
    path('populateLCH_Sku/', views.populateLCH_Sku),
    path('discount_grid/', views.discount_grid),
    path('discount_grid_detail/', views.discount_grid_detail),
]
