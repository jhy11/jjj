import json
from xmlrpc.client import Transport
from django.http import HttpRequest, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View
from django.contrib.auth.mixins import LoginRequiredMixin
from seller.views import constants

from management.models import order_product, order

class DeliveryView(LoginRequiredMixin, View):
    template_name='delivery_info.html'

    def get(self, request: HttpRequest):
        context = {
            'Paid': get_delivery(constants.DELIVERY, constants.PAID),
            'Completed': get_delivery(constants.DELIVERY, constants.COMPLETED),
            'Processing': get_delivery(constants.DELIVERY, constants.PROCESSING),
            'Shipping': get_delivery(constants.DELIVERY, constants.SHIPPING),
            'Delivered': get_delivery(constants.DELIVERY, constants.DELIVERED),
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
        Transport_no = request.PUT.get('transport_no')

        # Update order status 
        order.objects.filter(id=Id).update(
            status=constants.PROCESSING,
            transport_no = Transport_no,
        )

        # Update order-product status of the order
        product_ids=order_product.objects.filter(order_id=Id).values_list('id', flat=True)
        for id in product_ids:
            order_product.objects.filter(id=id).update(
                status=constants.PROCESSING,
            )

        context['success']=True

        return JsonResponse(context, content_type='application/json')


class ShortdeliveryView(LoginRequiredMixin, View):
    template_name='shortdelivery_info.html'

    def get(self, request: HttpRequest):
        context = {
            'Paid': get_delivery(constants.SHORTDELIVERY, constants.PAID),
            'Completed': get_delivery(constants.SHORTDELIVERY, constants.COMPLETED),
            'Processing': get_delivery(constants.SHORTDELIVERY, constants.PROCESSING),
            'Shipping': get_delivery(constants.SHORTDELIVERY, constants.SHIPPING),
            'Delivered': get_delivery(constants.SHORTDELIVERY, constants.DELIVERED),
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
        Transport_no = request.PUT.get('transport_no')

        # Update order status 
        order.objects.filter(id=Id).update(
            status=constants.PROCESSING,
            transport_no = Transport_no,
        )

        # Update order-product status of the order
        product_ids=order_product.objects.filter(order_id=Id).values_list('id', flat=True)
        for id in product_ids:
            order_product.objects.filter(id=id).update(
                status=constants.PROCESSING,
            )

        context['success']=True

        return JsonResponse(context, content_type='application/json')

def get_all_delivery(type):
    return order.objects.filter(type=type,  DeleteFlag='0')\
              .values('call', 'code', 'order_no', 'status', 'transport_no', 'date', 'id')

def get_delivery(type, status):
    return order.objects.filter(type=type, status=status, DeleteFlag='0')\
              .values('call', 'code', 'order_no', 'status', 'transport_no', 'date', 'id')

