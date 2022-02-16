import json
from django.http.request import QueryDict
from typing import Any, Dict
from django.http import HttpRequest, JsonResponse 
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View

from management.models import shop,shop_category

class ShopView(View):
    template_name = 'shop_info.html' 

    def get(self, request: HttpRequest, *args, **kwargs):
        context = {}
        context['ShopCategories'] = shop_category.objects.filter(DeleteFlag='0')
        context['table'] = shop.objects.filter(DeleteFlag='0')
        
        return render(request, self.template_name, context)

    def post(self, request: HttpRequest, *args, **kwargs):
        context = {}
        request.POST = json.loads(request.body)

        ShopName = request.POST.get('ShopName')
        ShopCategoryId = request.POST.get('ShopCategoryId')
        ShopCategory = shop_category.objects.filter(DeleteFlag='0').get(id=ShopCategoryId)
        Manager = request.POST.get('Manager')
        ShopPhone = request.POST.get('ShopPhone')

        # Check if shop already exists
        if shop.objects.filter(DeleteFlag='0', shop_name=ShopName).exists() is True:
            context['success'] = False
            context['message'] = '존재하는 점포입니다.'
            return JsonResponse(context, content_type='application/json')

        # Create new item
        shop.objects.create(
            shop_name=ShopName,
            shop_category=ShopCategory,
            manager=Manager,
            shop_phone=ShopPhone,
        )
        context['shops'] = list(shop.objects.filter(DeleteFlag='0').values('id', 'shop_category__name', 'shop_name', 'manager', 'shop_phone'))
        context['success'] = True

        return JsonResponse(context, content_type='application/json')

    def put(self, request: HttpRequest, *args, **kwargs):
        context = {}
        request.PUT = json.loads(request.body)

        Id = request.PUT.get('Id', None)
        ShopName = request.PUT.get('ShopName', None)
        ShopCategoryId = request.PUT.get('ShopCategoryId', None)
        ShopCategory = shop_category.objects.filter(DeleteFlag='0').get(id=ShopCategoryId)
        Manager = request.PUT.get('Manager', None)
        ShopPhone = request.PUT.get('ShopPhone', None)

        # Update item
        shop.objects.filter(id=Id).update(
            shop_name=ShopName,
            shop_category=ShopCategory,
            manager=Manager,
            shop_phone=ShopPhone,
        )
        
        context['shops'] = list(shop.objects.filter(DeleteFlag='0').values('id', 'shop_category__name', 'shop_name', 'manager', 'shop_phone'))
        context['success'] = True

        return JsonResponse(context, content_type='application/json')

    def delete(self, request: HttpRequest):
        context={}
        request.DELETE = json.loads(request.body)

        Id = request.DELETE.get('Id', None)
        if Id is not None:
            shop.delete(shop.objects.filter(DeleteFlag='0').get(id=Id))

            context['shops'] = list(shop.objects.filter(DeleteFlag='0').values('id', 'shop_category__name', 'shop_name', 'manager', 'shop_phone'))
            context['success'] = True
            
            return JsonResponse(context, content_type='application/json')

        return JsonResponse(data={ 'success': False })
