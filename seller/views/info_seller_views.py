from __future__ import print_function
import json
from queue import Empty
from django.http.request import QueryDict
from typing import Any, Dict
from django.http import HttpRequest, JsonResponse 
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View
from django.core.files.storage import FileSystemStorage, default_storage
from django.contrib.auth.mixins import LoginRequiredMixin
from . import constants

from management.models import member, product, pro_category, shop

class SellerProductView(LoginRequiredMixin, View):
    template_name = 'seller_info.html' 


    def get(self, request: HttpRequest, *args, **kwargs):
        memberId = member.objects.get(user=request.user).id
        memberShopId  = shop.objects.get(manager__id=memberId).id

        context = {
            'requestTable': product.objects.filter(shop_id =memberShopId, status=constants.REQUESTED, DeleteFlag='0'),
            'onSaleTable': product.objects.filter(shop_id =memberShopId, status=constants.ONSALE, DeleteFlag='0'),
            'ProCategories': pro_category.objects.filter(DeleteFlag='0'),
            }
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        
        return render(request, self.template_name, context)
    
    def post(self, request: HttpRequest, *args, **kwargs):
        context = {}
        request.POST = json.loads(request.body)

        memberId = member.objects.get(user=request.user).id
        memberShopId  = shop.objects.get(manager__id=memberId).id
        
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
            shop_id = memberShopId,
            status = constants.REQUESTED,
        )
        context['products'] = list(product.objects.filter(shop_id =memberShopId, status='0',DeleteFlag='0').values('id', 'pro_category__name', 'name', 'price', 'stock', 'description'))
        context['success']=True
        return JsonResponse(context, content_type='application/json')

    def put(self, request: HttpRequest, *args, **kwargs):
        context = {}
        request.PUT = json.loads(request.body)

        memberId = member.objects.get(user=request.user).id
        memberShopId  = shop.objects.get(manager__id=memberId).id
        
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
        )
        statusValue = product.objects.filter(id=Id).values('status')
        if (statusValue[0].get('status') == '0'):
            context['statusValue'] = 0
        else: 
            context['statusValue'] = 2
        
        context['products'] = list(product.objects.filter(shop_id =memberShopId, status='0', DeleteFlag='0').values('id', 'pro_category__name', 'name', 'price', 'stock', 'description'))
        context['products2'] = list(product.objects.filter(shop_id =memberShopId, status='2', DeleteFlag='0').values('id', 'pro_category__name', 'name', 'price', 'stock', 'description'))
        context['success'] = True
        
        return JsonResponse(context, content_type='application/json')

    def delete(self, request: HttpRequest):
        context={}     
        request.DELETE = json.loads(request.body)

        Id = request.DELETE.get('Id', None)
        if Id is not None:
            product.delete(product.objects.filter(DeleteFlag='0').get(id=Id))

            context['success'] = True

            return JsonResponse(context, content_type='application/json')
        return JsonResponse(data={ 'success': False })

class reapplyView(LoginRequiredMixin, View):
    template_name = 'seller_info.html' 

    def put(self, request: HttpRequest, *args, **kwargs):
        context = {}
        request.PUT = json.loads(request.body)
        
        Id = request.PUT.get('Id')  

        memberId = member.objects.get(user=request.user).id
        memberShopId  = shop.objects.get(manager__id=memberId).id

        # Update status
        product.objects.filter(id=Id).update(
            status = '0'
        )
        context['products'] = list(product.objects.filter(shop_id =memberShopId, status='0',DeleteFlag='0').values('id', 'pro_category__name', 'name', 'price', 'stock', 'description'))
        context['products2'] = list(product.objects.filter(shop_id =memberShopId, status='2',DeleteFlag='0').values('id', 'pro_category__name', 'name', 'price', 'stock', 'description'))
        context['success'] = True
        
        return JsonResponse(context, content_type='application/json')


class ProductDetailView(LoginRequiredMixin, View):
    template_name = 'product_detail.html' 
    def get(self, request: HttpRequest, *args, **kwargs):
        id = kwargs.get('id')
        seller_product = product.objects.get(id=id)
        context={}
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        context['product'] = seller_product

        return render(request, self.template_name,  context)

class ProductPostView(LoginRequiredMixin, View):
    template_name = 'product_post.html' 
    def get(self, request: HttpRequest, *args, **kwargs):
        context={}
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        context['ProCategories'] = pro_category.objects.filter(DeleteFlag='0')

        return render(request, self.template_name, context)
        
    def post(self, request: HttpRequest, *args, **kwargs):
        context = {}

        memberId = member.objects.get(user=request.user).id
        memberShopId  = shop.objects.get(manager__id=memberId).id
    
        mainImg = request.FILES.getlist('mainImg')
        ProductCategoryId = request.POST.get('ProductCategoryId')
        ProductCategory = pro_category.objects.filter(DeleteFlag='0',id=ProductCategoryId).first()
        Name = request.POST.get('ProductName')
        Price = request.POST.get('ProductPrice')
        Stock = request.POST.get('ProductStock')
        Description = request.POST.get('ProductDescription')

        for image in mainImg:
            product.objects.create(
                pro_category=ProductCategory,      
                name = Name,
                price = Price,
                stock = Stock,
                description = Description,
                main_img = image,
                shop_id = memberShopId,
                status = '0',
            )
        context['success']=True
        return JsonResponse(context, content_type='application/json')

class ProductEditView(LoginRequiredMixin, View):
    template_name = 'product_edit.html' 
    def get(self, request: HttpRequest, *args, **kwargs):
        id = kwargs.get('id')
     
        context={}
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        context['ProCategories'] = pro_category.objects.filter(DeleteFlag='0')
        context['product'] = product.objects.get(id=id)

        return render(request, self.template_name, context)
        
    def post(self, request: HttpRequest, *args, **kwargs):
        context = {}
        ProductId = request.POST.get('ProductId')
        mainImg = request.FILES.getlist('mainImg')

        ProductCategoryId = request.POST.get('ProductCategoryId')
        ProductCategory = pro_category.objects.filter(DeleteFlag='0',id=ProductCategoryId).first()
        Name = request.POST.get('ProductName')
        Price = request.POST.get('ProductPrice')
        Stock = request.POST.get('ProductStock')
        Description = request.POST.get('ProductDescription')

        if ProductId is None:
            context['success'] = False
            return JsonResponse(context, content_type='application/json')

        if not mainImg:
            product.objects.filter(id=ProductId).update(
                pro_category=ProductCategory,      
                name = Name,
                price = Price,
                stock = Stock,
                description = Description,
                )
        else:
            for image in mainImg:

                fileSystem = FileSystemStorage(location='media/product/main')
                uploadImgName = fileSystem.get_available_name(image.name)
                fileSystem.save(uploadImgName, image)

                image_url = "product/main/" + uploadImgName
    
                product.objects.filter(id=ProductId).update(
                    pro_category=ProductCategory,      
                    name = Name,
                    price = Price,
                    stock = Stock,
                    description = Description,
                    main_img = image_url,
                    )

        context['success'] = True
        context['productId'] = ProductId
        return JsonResponse(context, content_type='application/json')