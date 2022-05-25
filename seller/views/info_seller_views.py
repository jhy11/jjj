from __future__ import print_function
import json
from queue import Empty
import time
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
from management.models import product,order_product
from seller.forms import ProjectForm,ProjectSecondForm
from management.models import member, product, pro_subcategory, shop, order
from datetime import datetime
from datetime import date, timedelta
from django.utils.dateformat import DateFormat
from collections import Counter
from django.db.models import Q
import calendar


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
        memberId = member.objects.get(user=request.user).id
        memberShopId  = shop.objects.get(manager__id=memberId).id
        
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        
        secondform = ProjectSecondForm
      
        context['secondform'] = secondform
        context['ProCategories'] = pro_subcategory.objects.filter(DeleteFlag='0')
        context['memberShopId'] = memberShopId

        return render(request, self.template_name, context)
   
    def post(self, request: HttpRequest, *args, **kwargs):
        context = {}
        memberId = member.objects.get(user=request.user).id
        memberShopId  = shop.objects.get(manager__id=memberId).id
        secondform = ProjectSecondForm(request.POST or None, request.FILES or None)
       
        if secondform.is_valid():
            secondform.save()
            return redirect('seller:product-approval')
            

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

class recommendView(LoginRequiredMixin, View):
    template_name = 'analysis.html'
   
    def get(self, request: HttpRequest, *args, **kwargs):
        context={}
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        memberId = member.objects.get(user=request.user).id
        memberShopId  = shop.objects.get(manager__id=memberId).id
        pk = kwargs.get('id')
        
        #하루에 많이 팔린 상위품목5개
        today_list = list(order_product.objects.filter(product__shop_id=memberShopId,created_at__range=[date.today(), date.today() + timedelta(days=1)]).values('product_id','amount'))
        today_count,today_name = best5(today_list)
        context['today_count'] = today_count
        context['today_name'] = today_name
        
        #일주일에 많이 팔린 상위품목5개
        week_list = list(order_product.objects.filter(product__shop_id=memberShopId, created_at__range=[date.today()  - timedelta(days=6), date.today()]).values('product_id','id','amount'))
        week_count,week_name = best5(week_list)
        context['week_count'] = week_count
        context['week_name'] = week_name

        #하루 매출 주문금액 취소금액
       
        q = Q()
        q.add(Q(status=constants.CANCELED), q.OR)
        q.add(Q(status=constants.CANCEL_PROCESSING), q.OR)
        q.add(Q(status=constants.CANCEL_RECEIVED), q.OR)

        #today_sales = list(order_product.objects.filter(created_at__range=['2022-05-19', '2022-05-20'],product__shop_id=1, DeleteFlag='0',status=constants.PAID).values('product_id','id','amount'))
        #today_canceled = list((order_product.objects.filter(q)&order_product.objects.filter(created_at__range=['2022-05-19', '2022-05-20'],product__shop_id=1, DeleteFlag='0')).values('product_id','id','amount'))
        today_sales = list(order_product.objects.filter(created_at__range=[date.today(), date.today() + timedelta(days=1)],product__shop_id=memberShopId, DeleteFlag='0',status=constants.PAID).values('product_id','amount'))
        today_canceled = list((order_product.objects.filter(q)&order_product.objects.filter(created_at__range=[date.today(), date.today() + timedelta(days=1)],product__shop_id=memberShopId, DeleteFlag='0')).values('product_id','amount'))
        salesPrice = totalPrice(today_sales)
        cancelPrice = totalPrice(today_canceled)
        price = []
        price.append(salesPrice)
        price.append(cancelPrice)
        context['price'] = price

        #1년 매출 건수
        time_values = order_product.objects.filter(product__shop_id=memberShopId).order_by("created_at")
        time_values = [ element.created_at for element in time_values ]
        time_values = [ element.month for element in time_values ]
        published_amounts = [ 1 for element in time_values ]
        new_time_values = [ time_values[0] ]
        published_amounts = [ 1 ]
        j=0

        for i in range( 1, len(time_values) ):
            if time_values[i]==time_values[i-1]:
                published_amounts[j] = published_amounts[j] + 1
            else:   
                new_time_values.append(time_values[i])
                published_amounts.append(1)     
                j=j+1
        new_time_values = [calendar.month_name[element] for element in new_time_values ] 
        context['month'] = new_time_values
        context['numbers'] = published_amounts

        return render(request, self.template_name, context)

def best5(today_list):
    new_today = []
    result =[]
    count_list = []
    top5=[]
    name_list = []
    cnt = 0
    
    for today in today_list:
        if today['amount'] >= 1:
            new_today.extend([today['product_id']] *  today['amount'])
    for i in Counter(new_today).keys():
        cnt += 1
    if cnt<=5:
        nt = cnt
    else:
        nt = 5
    for i in range(nt):
        result.append(Counter(new_today).most_common(nt)[i][0])
    for i in range(nt):
        count_list.append(Counter(new_today).most_common(nt)[i][1])
    for ID in result:
        top5.append(list(product.objects.filter(id=ID).values('name'))[0])
    for top in top5:
        name_list.append(top['name'])
    return count_list,name_list

def totalPrice(today_sales):
    sales_today = []
    total = 0

    for today in today_sales:
        if today['amount'] >= 1:
            sales_today.extend([today['product_id']] * today['amount'])
    for ID in sales_today:
        price = (list(product.objects.filter(id=ID).values('price'))[0])['price']
        total += int(price)
    return total


       

    
    


    





