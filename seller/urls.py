from django.urls import path
from . import views
from .views import info_seller_views, info_qna_views

app_name = 'seller'

urlpatterns=[
    path('seller-product', info_seller_views.SellerProductView.as_view(), name='seller-product'),

    #판매자 상품
    path('product-detail/<str:id>', info_seller_views.ProductDetailView.as_view(), name='product-detail'),
    path('product-post', info_seller_views.ProductPostView.as_view(), name='product-post'),
    path('product-edit/<str:id>', info_seller_views.ProductEditView.as_view(), name='product-edit'),
    path('product-edit-submit', info_seller_views.ProductEditView.as_view(), name='product-edit-submit'),


    #문의
    path('qna', info_qna_views.QnaView.as_view(), name='qna'),
    path('qna-post/<str:id>', info_qna_views.QnaPostView.as_view(), name='qna-post'),
    path('qna-edit/<str:id>', info_qna_views.QnaEditView.as_view(), name='qna-edit'),

    path('reapply', info_seller_views.reapplyView.as_view(), name='reapply'),
]