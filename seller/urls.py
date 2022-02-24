from django.urls import path
from . import views
from .views import info_seller_views

app_name = 'seller'

urlpatterns=[
    path('seller_product', info_seller_views.SellerProductView.as_view(), name='seller_product'),
    path('reapply', info_seller_views.reapplyView.as_view(), name='reapply'),
]