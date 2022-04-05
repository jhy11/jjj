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
            'Paid': get_delivery(constants.PAID),
            'Completed': get_delivery(constants.COMPLETED),
            'Processing': get_delivery(constants.PROCESSING),
            'Shipping': get_delivery(constants.SHIPPING),
            'Delivered': get_delivery(constants.DELIVERED),
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

        order.objects.filter(id=Id).update(
            status=constants.PROCESSING,
            transport_no = Transport_no,
        )

        context['success']=True

        return JsonResponse(context, content_type='application/json')
    
def get_all_delivery():
    return order.objects.filter(type=constants.DELIVERY,  DeleteFlag='0')\
              .values('call', 'code', 'order_no', 'status', 'transport_no', 'date', 'id')

def get_delivery(status):
    return order.objects.filter(type=constants.DELIVERY, status=status, DeleteFlag='0')\
              .values('call', 'code', 'order_no', 'status', 'transport_no', 'date', 'id')

