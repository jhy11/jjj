from django.urls import path
from . import views
from .views import info_shop_views, info_product_views, info_member_views, info_order_views, info_qna_views

app_name = 'management'

urlpatterns=[
    path('shop', info_shop_views.ShopView.as_view(), name='shop'),
    path('product', info_product_views.ProductView.as_view(), name='product'),
    path('member', info_member_views.MemberView.as_view(), name='member'),

    path('order', info_order_views.OrderView.as_view(), name='order'),
    #path('order-data', info_order_views.PassData.as_view(), name='order-data')
    #path('order-detail', info_order_views.GetDetail.as_view(), name='order-detail'),

    path('qna', info_qna_views.QnaView.as_view(), name='qna'),
    path('qna-post/<str:id>', info_qna_views.QnaPostView.as_view(), name='qna-post'),
    path('qna-edit/<str:id>', info_qna_views.QnaEditView.as_view(), name='qna-edit'),

]