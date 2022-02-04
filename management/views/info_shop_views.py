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
        request.POST = json.loads(request.body)
        
        ShopName = request.POST.get('ShopName')
        ShopCategoryId = request.POST.get('ShopCategoryId')
        ShopCategory = shop_category.objects.get(id=ShopCategoryId)
        Manager = request.POST.get('Manager')
        ShopPhone = request.POST.get('ShopPhone')

        # Create new item
        shop.objects.create(
          shop_name=ShopName,
          shop_category=ShopCategory,
          manager=Manager,
          shop_phone=ShopPhone,
        )
        return JsonResponse(data={ 'success': True })

class ShopEditView(View):
    template_name = 'shop_info.html'

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context =  super().get_context_data(**kwargs)

        return context
  