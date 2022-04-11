from django.http import HttpRequest, JsonResponse 
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View
import json
from django.contrib.auth.mixins import LoginRequiredMixin
from seller.views import constants
from management.models import order, order_product

class OrderView(LoginRequiredMixin, View):
    template_name = 'order_info.html' 

    def get(self, request: HttpRequest, *args, **kwargs):

        context={
          'Paid': get_order_with_status(constants.PAID),
          'Completed': get_order_with_status(constants.COMPLETED),
          'Processing': get_order_with_status(constants.PROCESSING),
          'Shipping': get_order_with_status(constants.SHIPPING),
          'Deliverd': get_order_with_status(constants.DELIVERED),

          'RefundReceived': get_order_with_status(constants.REFUND_RECEIVED),
          'RefundProcessing': get_order_with_status(constants.REFUND_PROCESSING),
          'Refunded': get_order_with_status(constants.REFUNDED),

          'CancelReceived': get_order_with_status(constants.CANCEL_RECEIVED),
          'CancelProcessing': get_order_with_status(constants.CANCEL_PROCESSING),
          'Canceled': get_order_with_status(constants.CANCELED),

          'Pending': get_order_with_status(constants.PENDING),
        }

        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True


        return render(request, self.template_name, context)

class GetDetail(LoginRequiredMixin, View):

    def post(self, request:HttpRequest):
        context={}
        request.POST = json.loads(request.body)
        order_no = request.POST.get('order_no')

        context['success'] = True
        context['detail'] = list(order.objects.filter(order_no=order_no).values('order_no', 'type', 'status', 'name', 'call', 'code', 'address', 'member__mem_name', 'member__user__username', 'total_price', 'transport_no'))

        return JsonResponse(context, content_type="application/json")


#data for child table of order table
class OrderChild(LoginRequiredMixin, View):

    def get(self, request: HttpRequest, *args, **kwargs):
        context={}
        orderNo = kwargs.get('orderNo')
        context['data'] = list(order_product.objects.filter(order__order_no=orderNo).values('product__name', 'product__shop__shop_name', 'amount', 'status'))
        return JsonResponse(context, content_type="application/json")

def get_order_with_status(status):
  return order.objects.filter(DeleteFlag='0', status=status).values('order_no', 'type', 'name', 'call', 'code', 'address', 'member__mem_name', 'member__user__username', 'total_price', 'transport_no') 
