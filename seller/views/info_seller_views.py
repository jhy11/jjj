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
            'onSaleTable': product.objects.filter(shop_id ='3',status='2', DeleteFlag='0'),
            'ProCategories': pro_category.objects.filter(DeleteFlag='0'),
            }
        
        return render(request, self.template_name, context)
    
    def post(self, request: HttpRequest, *args, **kwargs):
        context = {}
        request.POST = json.loads(request.body)
        
        ProCategoryId = request.POST.get('ProductCategoryId')
        ProCategory = pro_category.objects.filter(DeleteFlag='0',id=ProCategoryId).first()
        Name = request.POST.get('ProductName')
        Price = request.POST.get('ProductPrice')
        Stock = request.POST.get('ProductStock')
        Description = request.POST.get('ProductDescription')

        product.objects.create(
            pro_category=ProCategory,      
            name = Name,
            price = Price,
            stock = Stock,
            description = Description,
            shop_id = '3',
            status = '0',
        )
        context['products'] = list(product.objects.filter(shop_id ='3', status='0',DeleteFlag='0').values('id', 'pro_category__name', 'name', 'price', 'stock', 'description'))
        context['success']=True
        return JsonResponse(context, content_type='application/json')

    def put(self, request: HttpRequest, *args, **kwargs):
        context = {}
        request.PUT = json.loads(request.body)
        
        Id = request.PUT.get('Id')
        ProCategoryId = request.PUT.get('ProductCategoryId')
        ProCategory = pro_category.objects.filter(DeleteFlag='0',id=ProCategoryId).first()
        Name = request.PUT.get('ProductName')
        Price = request.PUT.get('ProductPrice')
        Stock = request.PUT.get('ProductStock')
        Description = request.PUT.get('ProductDescription')
    
        product.objects.filter(id=Id).update(
            pro_category=ProCategory,      
            name = Name,
            price = Price,
            stock = Stock,
            description = Description,
            shop_id = '3',

        )
        statusValue = product.objects.filter(id=Id).values('status')
        if (statusValue[0].get('status') == '0'):
            context['statusValue'] = 0
        else: 
            context['statusValue'] = 2
        
        context['products'] = list(product.objects.filter(shop_id ='3', status='0', DeleteFlag='0').values('id', 'pro_category__name', 'name', 'price', 'stock', 'description'))
        context['products2'] = list(product.objects.filter(shop_id ='3', status='2', DeleteFlag='0').values('id', 'pro_category__name', 'name', 'price', 'stock', 'description'))
        context['success'] = True
        
        return JsonResponse(context, content_type='application/json')

    def delete(self, request: HttpRequest):
        context={}     
        request.DELETE = json.loads(request.body)

        Id = request.DELETE.get('Id', None)
        if Id is not None:
            product.delete(product.objects.filter(DeleteFlag='0').get(id=Id))

            context['products'] = list(product.objects.filter(shop_id ='3', status='0',DeleteFlag='0').values('id', 'pro_category__name', 'name', 'price', 'stock', 'description'))
            context['products2'] = list(product.objects.filter(shop_id ='3', status='2',DeleteFlag='0').values('id', 'pro_category__name', 'name', 'price', 'stock', 'description'))
            context['success'] = True

            return JsonResponse(context, content_type='application/json')
          
        return JsonResponse(data={ 'success': False })

class reapplyView(View):
    template_name = 'seller_info.html' 

    def put(self, request: HttpRequest, *args, **kwargs):
        context = {}
        request.PUT = json.loads(request.body)
        
        Id = request.PUT.get('Id')  
        # Update status
        product.objects.filter(id=Id).update(
            status = '0'
        )
        context['products'] = list(product.objects.filter(shop_id ='3', status='0',DeleteFlag='0').values('id', 'pro_category__name', 'name', 'price', 'stock', 'description'))
        context['products2'] = list(product.objects.filter(shop_id ='3', status='2',DeleteFlag='0').values('id', 'pro_category__name', 'name', 'price', 'stock', 'description'))
        context['success'] = True
        
        return JsonResponse(context, content_type='application/json')


        