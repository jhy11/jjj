import json
from django.http import HttpRequest, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q 
from . import constants
from .info_delivery_views import get_delivery, check_order_status

from management.models import order_product

class PickupView(LoginRequiredMixin, View):
    '''
    관리자/판매관리/포장
    '''

    template_name='pickup.html'

    def get(self, request: HttpRequest):
        user_id=request.user.id

        context = {
            'Paid': get_delivery(user_id, constants.PICKUP, constants.PAID),
            'Completed': get_delivery(user_id, constants.PICKUP, constants.COMPLETED),
            'Processing': get_delivery(user_id, constants.PICKUP, constants.PROCESSING),
            #'Shipping': get_delivery(user_id, constants.PICKUP, constants.SHIPPING),
            'Delivered': get_delivery(user_id, constants.PICKUP, constants.DELIVERED),
        }
        print(context)
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        
        return render(request, self.template_name, context)

    def put(self, request: HttpRequest):
        context={}
        request.PUT = json.loads(request.body)

        Id = request.PUT.get('id')

        order_product.objects.filter(id=Id).update(
            status=constants.COMPLETED
        )
        check_order_status(Id)

        context['success']=True

        return JsonResponse(context, content_type='application/json')


class DrivethruView(LoginRequiredMixin, View):
    '''
    관리자/판매관리/드라이브스루
    '''

    template_name='drivethru.html'

    def get(self, request: HttpRequest):
        user_id=request.user.id

        context = {
            'Paid': get_delivery(user_id, constants.DRIVETHRU, constants.PAID),
            'Completed': get_delivery(user_id, constants.DRIVETHRU, constants.COMPLETED),
            'Processing': get_delivery(user_id, constants.DRIVETHRU, constants.PROCESSING),
            #'Shipping': get_delivery(user_id, constants.DRIVETHRU, constants.SHIPPING),
            'Delivered': get_delivery(user_id, constants.DRIVETHRU, constants.DELIVERED),
        }

        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        
        return render(request, self.template_name, context)

    def put(self, request: HttpRequest):
        context={}
        request.PUT = json.loads(request.body)

        Id = request.PUT.get('id')

        order_product.objects.filter(id=Id).update(
            status=constants.COMPLETED
        )
        check_order_status(Id)

        context['success']=True

        return JsonResponse(context, content_type='application/json')