import json
from django.http.request import QueryDict
from typing import Any, Dict
from django.http import HttpRequest, JsonResponse 
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View
from django.contrib.auth.mixins import LoginRequiredMixin
from seller.views import constants

from management.models import product, pro_subcategory, shop

class ProductView(LoginRequiredMixin, View):
    '''
    관리자 상품 관리
    '''
    template_name = 'product_info.html' 

    def get(self, request: HttpRequest, *args, **kwargs):
        context = {
            'ProCategories': pro_subcategory.objects.filter(DeleteFlag='0'),
            }
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        
        return render(request, self.template_name, context)


class ProductDetailView(LoginRequiredMixin, View):
    '''
    상품 상세 페이지
    '''
    template_name = 'manage_product_detail.html' 

    def get(self, request: HttpRequest, *args, **kwargs):
        id = kwargs.get('id')
        Product = product.objects.get(id=id)

        context={}
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True

        context['product'] = Product

        return render(request, self.template_name,  context)

    '''
    상품 승인, 반려, 판매중지
    ''' 
    def put(self, request: HttpRequest, *args, **kwargs):
        context = {}
        request.PUT = json.loads(request.body)
        
        Id = request.PUT.get('Id')  
        Status = request.PUT.get('Status')

        # Update status
        product.objects.filter(id=Id, DeleteFlag='0').update(
            status = Status
        )
        
        context['success'] = True
        return JsonResponse(context, content_type='application/json')

    '''
    상품 삭제
    ''' 
    def delete(self, request: HttpRequest, *args, **kwargs):
        context={}     
        request.DELETE = json.loads(request.body)

        Id = request.DELETE.get('Id', None)
        
        if Id is not None:
            product.delete(product.objects.filter(DeleteFlag='0').get(id=Id))

            context['success'] = True

            return JsonResponse(context, content_type='application/json')
          
        return JsonResponse(data={ 'success': False })

class ProductTableView(LoginRequiredMixin, View):
    '''
    관리자페이지/판매자/상품관리

    Datatable에 넣을 데이터를 받아옵니다.
    '''
    def get(self, request: HttpRequest):

        productsRequested = get_product(constants.REQUESTED)
        productsOnSale = get_product(constants.ONSALE)
        productsRejected = get_product(constants.REJECTED)
        productsStopped =get_product(constants.STOPPED)

        context = {
            'productsRequested': productsRequested,
            'productsOnSale': productsOnSale,
            'productsRejected': productsRejected,
            'productsStopped': productsStopped,
        }

        return JsonResponse(context, content_type='application/json')

def get_product(status):
    return list(product.objects.filter(status=status, DeleteFlag='0')\
              .values('id', 'pro_subcategory__name', 'name', 'price', 'status', 'stock', 'shop__shop_name'))
