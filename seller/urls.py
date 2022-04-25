from django.urls import path

from . import views
from .views import info_delivery_views, info_shortdelivery_views, info_takeout_views, info_seller_views, \
                info_product_views, info_qna_views, info_cancel_views, info_refund_views, info_product_approval_views,info_review_views

app_name = 'seller'

urlpatterns=[

    #판매 관리
    path('delivery', info_delivery_views.DeliveryView.as_view(), name='delivery'),
    path('delivery-table', info_delivery_views.DeliveryTableView.as_view(), name='delivery-table'),

    path('shortdelivery', info_shortdelivery_views.ShortdeliveryView.as_view(), name='shortdelivery'),
    path('shortdelivery-table', info_shortdelivery_views.ShortdeliveryTableView.as_view(), name='shortdelivery-table'),

    path('pickup', info_takeout_views.PickupView.as_view(), name='pickup'),
    path('pickup-table', info_takeout_views.PickupTableView.as_view(), name='pickup-table'),

    path('drivethru', info_takeout_views.DrivethruView.as_view(), name='drivethru'),
    path('drivethru-table', info_takeout_views.DrivethruTableView.as_view(), name='drivethru-table'),

    path('cancel', info_cancel_views.CancelView.as_view(), name='cancel'),
    path('cancel-table', info_cancel_views.CancelTableView.as_view(), name='cancel-table'),

    path('refund', info_refund_views.RefundView.as_view(), name='refund'),
    path('refund-table', info_refund_views.RefundTableView.as_view(), name='refund-table'),

    path('seller-product', info_seller_views.SellerProductView.as_view(), name='seller-product'),
    path('product-approval', info_product_approval_views.ApprovalView.as_view(), name='product-approval'),
    path('product-reapply', info_product_approval_views.ReapplyView.as_view(), name='product-reapply'),
    path('product-stop', info_product_views.ProductstoppedView.as_view(), name='product-stop'),
    
    

    #상품 관리
    path('product-list', info_product_views.ProductListView.as_view(), name='product-list'),
    path('product-table', info_product_views.ProductTableView.as_view(), name='product-table'),
    path('product-detail/<str:id>', info_seller_views.ProductDetailView.as_view(), name='product-detail'),
    path('product-post', info_seller_views.ProductPostView.as_view(), name='product-post'),
    path('product-edit/<str:id>', info_seller_views.ProductEditView.as_view(), name='product-edit'),
    path('product-edit-submit', info_seller_views.ProductEditView.as_view(), name='product-edit-submit'),
    path('product-image',info_seller_views.ProductImageView.as_view(), name='product-image'),
  

    #문의/리뷰
    path('qna', info_qna_views.QnaView.as_view(), name='qna'),
    path('qna-post/<str:id>', info_qna_views.QnaPostView.as_view(), name='qna-post'),
    path('qna-edit/<str:id>', info_qna_views.QnaEditView.as_view(), name='qna-edit'),
    path('review', info_review_views.ReviewView.as_view(), name='review'),
    path('review-post/<str:id>', info_review_views.ReviewPostView.as_view(), name='review-post'),
    path('review-edit/<str:id>', info_review_views.ReviewEditView.as_view(), name='review-edit'),

]