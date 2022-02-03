from django.urls import path
from . import views
from .views import info_shop_views

app_name = 'management'

urlpatterns=[
     path('info-shop', info_shop_views.PageView.as_view(), name='info-shop'),
]