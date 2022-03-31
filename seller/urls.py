from django.urls import path

from . import views
from .views import  info_seller_views, info_product_views, info_qna_views #info_delivery_views, 

app_name = 'seller'

urlpatterns=[

    #판매 관리
    #path('delivery', info_delivery_views.DeliveryView.as_view(), name='delivery'),
    path('seller-product', info_seller_views.SellerProductView.as_view(), name='seller-product'),

    #상품 관리
    path('product-list', info_product_views.ProductListView.as_view(), name='product-list'),
    path('product-detail/<str:id>', info_seller_views.ProductDetailView.as_view(), name='product-detail'),
    path('product-post', info_seller_views.ProductPostView.as_view(), name='product-post'),
    path('product-edit/<str:id>', info_seller_views.ProductEditView.as_view(), name='product-edit'),
    path('product-edit-submit', info_seller_views.ProductEditView.as_view(), name='product-edit-submit'),

    #문의/리뷰
    path('qna', info_qna_views.QnaView.as_view(), name='qna'),
    path('qna-post/<str:id>', info_qna_views.QnaPostView.as_view(), name='qna-post'),
    path('qna-edit/<str:id>', info_qna_views.QnaEditView.as_view(), name='qna-edit'),
    #path('review', info_review_views.ReviewView.as_view(), name='review'),

    path('reapply', info_seller_views.reapplyView.as_view(), name='reapply'),
]