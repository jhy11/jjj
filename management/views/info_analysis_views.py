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



class analysisView(LoginRequiredMixin, View):
    template_name = 'shop_analysis.html'
   
    def get(self, request: HttpRequest, *args, **kwargs):
        context = {}
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
       
        pk = kwargs.get('id')
        
        #하루에 많이 팔린 상위품목5개
        today_list = list(order_product.objects.filter(created_at__range=[date.today(), date.today() + timedelta(days=1)]).values('product_id','amount'))
        today_count,today_name = best5(today_list)
        context['today_count'] = today_count
        context['today_name'] = today_name
        
        #일주일에 많이 팔린 상위품목5개
        week_list = list(order_product.objects.filter( created_at__range=[date.today()  - timedelta(days=6), date.today()]).values('product_id','id','amount'))
        week_count,week_name = best5(week_list)
        context['week_count'] = week_count
        context['week_name'] = week_name

        #하루 매출 주문금액 취소금액
       
        q = Q()
        q.add(Q(status=constants.CANCELED), q.OR)
        q.add(Q(status=constants.CANCEL_PROCESSING), q.OR)
        q.add(Q(status=constants.CANCEL_RECEIVED), q.OR)

        today_sales = list(order_product.objects.filter(created_at__range=[date.today(), date.today() + timedelta(days=1)], DeleteFlag='0',status=0).values('product_id','amount'))
        today_canceled = list((order_product.objects.filter(q)&order_product.objects.filter(created_at__range=[date.today(), date.today() + timedelta(days=1)], DeleteFlag='0')).values('product_id','amount'))
        salesPrice = totalPrice(today_sales)
        cancelPrice = totalPrice(today_canceled)
        price = []
        price.append(salesPrice)
        price.append(cancelPrice)
        context['price'] = price

        #1년 매출 건수
        time_values = order_product.objects.all().order_by("created_at")
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