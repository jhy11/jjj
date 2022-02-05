from django.urls import path
from . import views
from .views import info_shop_views

app_name = 'management'

urlpatterns=[
    path('shop', info_shop_views.ShopView.as_view(), name='shop'),
]