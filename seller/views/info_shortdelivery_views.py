import json
from django.http import HttpRequest, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View
from django.contrib.auth.mixins import LoginRequiredMixin
from . import constants
from .info_delivery_views import get_delivery, check_order_status

from management.models import order_product

class ShortdeliveryView(LoginRequiredMixin, View):
    '''
    판매자/판매관리/근거리배송
    '''
    template_name='shortdelivery.html'

    def get(self, request: HttpRequest):
        context={}

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

class ShortdeliveryTableView(LoginRequiredMixin, View):
    '''
    판매자/판매관리/근거리배송 관리

    Datatable에 넣을 데이터를 받아옵니다.
    '''
    def get(self, request: HttpRequest):
        user_id=request.user.id

        Paid = get_delivery(user_id, constants.SHORTDELIVERY, constants.PAID)
        Completed = get_delivery(user_id, constants.SHORTDELIVERY, constants.COMPLETED)
        Processing = get_delivery(user_id, constants.SHORTDELIVERY, constants.PROCESSING)
        Shipping = get_delivery(user_id, constants.SHORTDELIVERY, constants.SHIPPING)
        Delivered = get_delivery(user_id, constants.SHORTDELIVERY, constants.DELIVERED)

        delivery=[] 
        delivered=[]

        delivery.extend(Paid)
        delivery.extend(Completed)
        delivered.extend(Processing)
        delivered.extend(Shipping)
        delivered.extend(Delivered)

        context = {
            'delivery': delivery,
            'delivered': delivered,
        }

        return JsonResponse(context, content_type='application/json')
