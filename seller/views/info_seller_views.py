from __future__ import print_function
import json
from django.http.request import QueryDict
from typing import Any, Dict
from django.http import HttpRequest, JsonResponse 
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View

from management.models import product, pro_category, shop

class SellerProductView(View):
    template_name = 'seller_info.html' 


    def get(self, request: HttpRequest, *args, **kwargs):
        context = {
            'requestTable': product.objects.filter(shop_id ='3', status='0', DeleteFlag='0'),
            #'onSaleTable': product.objects.filter(status='1', DeleteFlag='0'),
            'ProCategories': pro_category.objects.filter(DeleteFlag='0'),
            }
        
        return render(request, self.template_name, context)
    
    def post(self, request: HttpRequest, *args, **kwargs):
        context = {}
        request.POST = json.loads(request.body)

        ProCategoryId = request.POST.get('ProductCategoryId')
        ProCategory = pro_category.objects.filter(DeleteFlag='0').get(id=ProCategoryId)
        Name = request.POST.get('ProductName')
        Price = request.POST.get('ProductPrice')
        Stock = request.POST.get('ProductStock')
        Description = request.POST.get('ProductDescription')

        if shop.objects.filter(DeleteFlag='0', name=Name).exists() is True:
            context['success'] = False
            context['message'] = '존재하는 상품입니다.'
            return JsonResponse(context, content_type='application/json')


        product.objects.create(
            pro_category =  ProCategory,      
            name = Name,
            price = Price,
            stock = Stock,
            description = Description,
            shop_id = 3,
            status = 0,
        )
        context = {
             'ProCategory': ProCategory.name,
             'Name': Name,
             'Price': Price,
             'Stock': Stock,
             'Description': Description,
             'success': True,
        }

        return JsonResponse(context, content_type='application/json')

    def put(self, request: HttpRequest, *args, **kwargs):
        context = {}
        request.PUT = json.loads(request.body)

        ProductId = request.PUT.get('ProductId')
        Category = request.PUT.get('Category')
        Category = pro_category.objects.filter(DeleteFlag='0').get(name=Category)
        Shop = request.PUT.get('Shop')
        Shop = shop.objects.filter(DeleteFlag='0').get(shop_name=Shop)
        Status = request.PUT.get('Status')
        Name = request.PUT.get('Name')
        Price = request.PUT.get('Price')
        Stock = request.PUT.get('Stock')
        Description = request.PUT.get('Description')

        # Update status
        product.objects.filter(id=ProductId, DeleteFlag='0').update(
            pro_category=Category,
            shop=Shop,
            name=Name,
            price=Price,
            stock=Stock,
            status=Status,
            description = Description
        )

        context['success'] = True
        
        return JsonResponse(context, content_type='application/json')

    def delete(self, request: HttpRequest):
        request.DELETE = json.loads(request.body)

        productId = request.DELETE.get('productId', None)
        if productId is not None:
            product.delete(product.objects.filter(DeleteFlag='0').get(id=productId))

            return JsonResponse(data={ 'success': True })
        return JsonResponse(data={ 'success': False })
