from django.http import HttpRequest
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View
from django.contrib.auth.mixins import LoginRequiredMixin
from . import constants

from management.models import order_product

class RefundView(LoginRequiredMixin, View):
    template_name='refund.html'

    def get(self, request: HttpRequest):
        user_id=request.user.id

        context = {
            'RefundRequested': get_refund_of_product(user_id, constants.REFUND_RECEIVED),
            'RefundProcessing': get_refund_of_product(user_id, constants.REFUND_PROCESSING),
            'Refunded': get_refund_of_product(user_id, constants.REFUNDED),
            'NotCompletelyRefunded': get_refund(user_id, constants.REFUND_RECEIVED),
        }

        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        
        return render(request, self.template_name, context)

def get_refund_of_product(user_id, status):
    return order_product.objects.filter(product__shop_id__manager_id__user_id=user_id, status=status, DeleteFlag='0')\
              .values('order__code', 'order__call', 'order__total_price', 'order__order_no', 'order__status', 'order__date', 'order__type')

def get_refund(user_id, status):
    return order_product.objects.filter(product__shop_id__manager_id__user_id=user_id, order__status=status, status=constants.REFUNDED, DeleteFlag='0')\
              .values('order__code', 'order__call', 'order__total_price', 'order__order_no', 'order__status', 'order__date', 'order__type')
