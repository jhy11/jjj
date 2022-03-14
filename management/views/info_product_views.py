import json
from django.http.request import QueryDict
from typing import Any, Dict
from django.http import HttpRequest, JsonResponse 
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View
from django.contrib.auth.mixins import LoginRequiredMixin

from management.models import product, pro_category, shop

class ProductView(LoginRequiredMixin, View):
    template_name = 'product_info.html' 

    def get(self, request: HttpRequest, *args, **kwargs):
        context = {
            'requestTable': product.objects.filter(status='0', DeleteFlag='0'),
            'onSaleTable': product.objects.filter(status='1', DeleteFlag='0'),
            'ProCategories': pro_category.objects.filter(DeleteFlag='0'),
            }
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        
        return render(request, self.template_name, context)

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
