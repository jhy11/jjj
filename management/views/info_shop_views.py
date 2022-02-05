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
        if shop.objects.filter(shop_name=ShopName).exists() is True:
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
        
        context = {
            'ShopId': shop.objects.get(shop_name=ShopName).id,
            'ShopCategory': ShopCategory.name,
            'ShopName': ShopName,
            'Manager': Manager,
            'ShopPhone' : ShopPhone,
            'success': True,
        }
        return JsonResponse(context, content_type='application/json')

    def put(self, request: HttpRequest, *args, **kwargs):
        context = {}
        request.PUT = json.loads(request.body)
        print(request.PUT)

        ShopName = request.PUT.get('ShopName')
        ShopCategoryId = request.PUT.get('ShopCategoryId')
        ShopCategory = shop_category.objects.filter(DeleteFlag='0').get(id=ShopCategoryId)
        Manager = request.PUT.get('Manager')
        ShopPhone = request.PUT.get('ShopPhone')

        # Check if shop already exists
        if shop.objects.filter(shop_name=ShopName).count() > 1:
            context['success'] = False
            context['message'] = '존재하는 점포입니다.'
            print('exi')
            return JsonResponse(context, content_type='application/json')

        # Update item
        shop.objects.filter(shop_name=ShopName, DeleteFlag='0').update(
            shop_name=ShopName,
            shop_category=ShopCategory,
            manager=Manager,
            shop_phone=ShopPhone,
        )
        
        context = {
            'ShopId': shop.objects.get(shop_name=ShopName).id,
            'ShopCategory': ShopCategory.name,
            'ShopName': ShopName,
            'Manager': Manager,
            'ShopPhone' : ShopPhone,
            'success': True,
        }

        return JsonResponse(context, content_type='application/json')

    def delete(self, request: HttpRequest):
        request.DELETE = json.loads(request.body)

        ShopName = request.DELETE.get('ShopName', None)
        if ShopName is not None:
            shop.delete(shop.objects.filter(DeleteFlag='0').get(shop_name=ShopName))

            return JsonResponse(data={ 'success': True })
        return JsonResponse(data={ 'success': False })
