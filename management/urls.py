from django.urls import path

from . import views
from .views import info_product_views, info_member_views, info_order_views, info_qna_views, info_shop_views,\
                info_delivery_views

app_name = 'management'

urlpatterns=[
    #점포 관리
    path('shop', info_shop_views.ShopView.as_view(), name='shop'),
    #상품 관리
    path('product', info_product_views.ProductView.as_view(), name='product'),
    path('manage-product-detail/<str:id>', info_product_views.ProductDetailView.as_view(), name='manage-product-detail'),
    path('change-status', info_product_views.ProductDetailView.as_view(), name='change-status'),
    #회원 관리
    path('member', info_member_views.MemberView.as_view(), name='member'),
    #주문 관리
    path('order', info_order_views.OrderView.as_view(), name='order'),
    #주문 상세 내역
    path('show-child/<str:orderNo>', info_order_views.OrderChild.as_view(), name='show-child'),
    #path('order-data', info_order_views.PassData.as_view(), name='order-data')
    #path('order-detail', info_order_views.GetDetail.as_view(), name='order-detail'),


    # 판매관리
    path('delivery', info_delivery_views.DeliveryView.as_view(), name='delivery'),
    path('delivery-table', info_delivery_views.DeliveryTableView.as_view(), name='delivery-table'),

    path('shortdelivery', info_delivery_views.ShortdeliveryView.as_view(), name='shortdelivery'),
    path('shortdelivery-table', info_delivery_views.ShortdeliveryTableView.as_view(), name='shortdelivery-table'),
    
    path('pickup', info_delivery_views.PickupView.as_view(), name='pickup'),
    path('pickup-table', info_delivery_views.PickupTableView.as_view(), name='pickup-table'),

    path('drivethru', info_delivery_views.DrivethruView.as_view(), name='drivethru'),
    path('drivethru-table', info_delivery_views.DrivethruTableView.as_view(), name='drivethru-table'),


    #문의 관리
    path('qna', info_qna_views.QnaView.as_view(), name='qna'),
    path('qna-post/<str:id>', info_qna_views.QnaPostView.as_view(), name='qna-post'),
    path('qna-edit/<str:id>', info_qna_views.QnaEditView.as_view(), name='qna-edit'),

]