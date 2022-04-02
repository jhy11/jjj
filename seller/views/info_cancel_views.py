from django.http import HttpRequest
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View
from django.contrib.auth.mixins import LoginRequiredMixin
from . import constants

from management.models import order_product

class CancelView(LoginRequiredMixin, View):
    template_name='cancel.html'

    def get(self, request: HttpRequest):
        user_id=request.user.id

        context = {
            'CancelReceived': get_cancellation_of_product(user_id, constants.CANCEL_RECEIVED),
            'CancelProcessing': get_cancellation_of_product(user_id, constants.CANCEL_PROCESSING),
            'Canceled': get_cancellation_of_product(user_id, constants.CANCELED),
            'NotCompletelyCanceled': get_cancellation(user_id, constants.CANCEL_RECEIVED),
        }

        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        
        return render(request, self.template_name, context)

def get_cancellation_of_product(user_id, status):
    return order_product.objects.filter(product__shop_id__manager_id__user_id=user_id, status=status, DeleteFlag='0')\
              .values('order__code', 'order__call', 'order__total_price', 'order__order_no', 'order__status', 'order__date', 'order__type')

def get_cancellation(user_id, status):
    return order_product.objects.filter(product__shop_id__manager_id__user_id=user_id, order__status=status, status=constants.CANCELED, DeleteFlag='0')\
              .values('order__code', 'order__call', 'order__total_price', 'order__order_no', 'order__status', 'order__date', 'order__type')
