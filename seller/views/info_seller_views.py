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
    '''
    판매자 상품 관리 
    '''
    template_name = 'seller_info.html' 
   
    def get(self, request: HttpRequest, *args, **kwargs):
        memberId = member.objects.get(user=request.user).id
        memberShopId  = shop.objects.get(manager__id=memberId).id

        context = {
            'requestTable': product.objects.filter(shop_id =memberShopId, status=constants.REQUESTED, DeleteFlag='0'),
            'rejectedTable': product.objects.filter(shop_id =memberShopId, status=constants.REJECTED, DeleteFlag='0'),
            'ProCategories': pro_category.objects.filter(DeleteFlag='0'),
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
    '''
    상품 등록
    '''
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
        Content = request.POST.get('Content')

        for image in mainImg:
            product.objects.create(
                pro_category=ProductCategory,      
                name = Name,
                price = Price,
                stock = Stock,
                description = Description,
                main_img = image,
                shop_id = memberShopId,
                status = constants.REQUESTED,
                content = Content,
            )
        context['success']=True
        return JsonResponse(context, content_type='application/json')

class ProductEditView(LoginRequiredMixin, View):
    '''
    상품 수정
    '''
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
        Content = request.POST.get('Content')
        

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
                content = Content,
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
                    content = Content,
                    )

        context['success'] = True
        context['productId'] = ProductId
        context['Content'] = Content
        return JsonResponse(context, content_type='application/json')

