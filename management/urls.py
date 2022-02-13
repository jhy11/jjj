from django.urls import path
from . import views
from .views import info_shop_views, info_product_views, info_member_views

app_name = 'management'

urlpatterns=[
    path('shop', info_shop_views.ShopView.as_view(), name='shop'),
    path('product', info_product_views.ProductView.as_view(), name='product'),
    path('member', info_member_views.MemberView.as_view(), name='member'),
]