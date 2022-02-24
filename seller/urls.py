from django.urls import path
from . import views
from .views import info_seller_views, info_qna_views

app_name = 'seller'

urlpatterns=[
    path('seller_product', info_seller_views.SellerProductView.as_view(), name='seller_product'),
    path('qna', info_qna_views.QnaView.as_view(), name='qna'),
    path('qna-post/<str:id>', info_qna_views.QnaPostView.as_view(), name='qna-post'),
    path('qna-edit/<str:id>', info_qna_views.QnaEditView.as_view(), name='qna-edit'),

]