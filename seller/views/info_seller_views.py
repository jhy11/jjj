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
from PIL import Image
import os,io
from django.core.files.base import ContentFile
from django.shortcuts import render
from management.models import product
from seller.forms import ProjectForm,ProjectSecondForm

from management.models import member, product, pro_subcategory, shop
class ProductImageView(LoginRequiredMixin, View):
    template_name = 'product_image.html' 

    def get(self, request: HttpRequest, *args, **kwargs):
        context= {}
        return render(request, self.template_name, context)
        

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
    template_name = 'product_detail.html' 
    def get(self, request: HttpRequest, *args, **kwargs):
        context={}
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        context['ProCategories'] = pro_subcategory.objects.filter(DeleteFlag='0')
        context['product'] = product.objects.filter(DeleteFlag='0')

        pk = kwargs.get('id')
        eachProduct =  product.objects.get(id=pk)
        
        context["eachProduct"] = eachProduct
       
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
        
        secondform = ProjectSecondForm
      
        context['secondform'] = secondform
        context['ProCategories'] = pro_subcategory.objects.filter(DeleteFlag='0')

        return render(request, self.template_name, context)
   
    def post(self, request: HttpRequest, *args, **kwargs):
        context = {}
        memberId = member.objects.get(user=request.user).id
        memberShopId  = shop.objects.get(manager__id=memberId).id
        secondform = ProjectSecondForm(request.POST or None, request.FILES or None,)
       
        if secondform.is_valid():
          
            post = secondform.save()
            return redirect('seller:product-approval')
            #return JsonResponse({'message': 'works'})

        context['secondform'] = secondform
        context['success']=True
        return render(request, self.template_name, context)

class ProductEditView(LoginRequiredMixin, View):
    '''
    상품 수정
    '''
    template_name = 'product_edit.html' 

    def get(self, request: HttpRequest, *args, **kwargs):
        context={}
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        context['ProCategories'] = pro_subcategory.objects.filter(DeleteFlag='0')
        context['product'] = product.objects.filter(DeleteFlag='0')
        
        pk = kwargs.get('id')
        order = get_object_or_404(product, id=pk)
        secondform = ProjectSecondForm(instance = order)
        
        context["secondform"] = secondform
       
        return render(request, self.template_name,  context)
        
    def post(self, request: HttpRequest, *args, **kwargs):
        context = {}
        memberId = member.objects.get(user=request.user).id
        memberShopId  = shop.objects.get(manager__id=memberId).id
        pk = kwargs.get('id')
        order = get_object_or_404(product, id=pk)
      
        secondform = ProjectSecondForm(request.POST, request.FILES, instance=order)
        if secondform.is_valid():
            secondform.save()
            return redirect('seller:product-list')
           
        context['secondform'] = secondform
        return render(request,self.template_name, context)

class ProductDeleteView(LoginRequiredMixin, View):
    def get(self, request: HttpRequest, *args, **kwargs):
        pk = kwargs.get('id')
        product.objects.get(id=pk).delete()
        return redirect('seller:product-approval')

class ProductReapplyView(LoginRequiredMixin, View):
    def get(self, request: HttpRequest, *args, **kwargs):
        pk = kwargs.get('id')
        product.objects.filter(id=pk).update(
            status = constants.REQUESTED
        )
        return redirect('seller:product-approval')





