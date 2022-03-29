from django.http import HttpRequest
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View
from django.contrib.auth.mixins import LoginRequiredMixin
from . import constants

from management.models import order_product

class DeliveryView(LoginRequiredMixin, View):
    template_name='delivery.html'

    def get(self, request: HttpRequest):
        user_id=request.user.id

        context = {
            'Paid': get_delivery(user_id, constants.PAID),
            'Completed': get_delivery(user_id, constants.COMPLETED),
            'Processing': get_delivery(user_id, constants.PROCESSING),
            'Shipping': get_delivery(user_id, constants.SHIPPING),
            'Delivered': get_delivery(user_id, constants.DELIVERED),
        }
        print(context)
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        
        return render(request, self.template_name, context)

def get_all_delivery(user_id):
    return order_product.objects.filter(product__shop_id__manager_id__user_id=user_id, order__type=constants.DELIVERY,  DeleteFlag='0')\
              .values('order__code', 'order__call', 'order__total_price', 'order__order_no', 'order__status', 'order__transport_no', 'order__date')

def get_delivery(user_id, status):
    return order_product.objects.filter(product__shop_id__manager_id__user_id=user_id, order__type=constants.DELIVERY, order__status=status, DeleteFlag='0')\
              .values('order__code', 'order__call', 'order__total_price', 'order__order_no', 'order__status', 'order__transport_no', 'order__date')
