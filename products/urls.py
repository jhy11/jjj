from django.urls import path
from . import views

app_name = 'products'

urlpatterns=[
    path('',views.PageView.as_view(), name='test'),
]