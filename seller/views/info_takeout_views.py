from django.http import HttpRequest
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.db.models import Q 
from . import constants

from management.models import order_product

class TakeoutView(LoginRequiredMixin, View):
    template_name='takeout.html'

    def get(self, request: HttpRequest):
        user_id=request.user.id

        context = {
            'Paid': get_delivery(user_id, constants.PAID),
            'Completed': get_delivery(user_id, constants.COMPLETED),
            'Processing': get_delivery(user_id, constants.PROCESSING),
            #'Shipping': get_delivery(user_id, constants.SHIPPING),
            'Delivered': get_delivery(user_id, constants.DELIVERED),
        }
        print(context)
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        
        return render(request, self.template_name, context)

def get_all_delivery(user_id, type):
    return order_product.objects.filter(Q(product__shop_id__manager_id__user_id=user_id) & (Q(order__type=constants.DRIVETHRU) | Q(order__type=constants.PICKUP)) & Q(DeleteFlag='0'))\
              .values('order__code', 'order__call', 'order__total_price', 'order__order_no', 'order__type' 'order__date')

def get_delivery(user_id, status):
    return order_product.objects.filter(Q(product__shop_id__manager_id__user_id=user_id) & (Q(order__type=constants.DRIVETHRU) | Q(order__type=constants.PICKUP)) & Q(DeleteFlag='0') & Q(order__status=status))\
              .values('order__code', 'order__call', 'order__total_price', 'order__order_no', 'order__type', 'order__date')
