import json
from django.http import HttpRequest, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View
from django.contrib.auth.mixins import LoginRequiredMixin
from . import constants

from management.models import order_product, order

class DeliveryView(LoginRequiredMixin, View):
    '''
    관리자/판매 관리/택배배송 관리
    '''
    template_name='delivery.html'

    def get(self, request: HttpRequest):
        user_id=request.user.id

        context = {
            'Paid': get_delivery(user_id, constants.DELIVERY, constants.PAID),
            'Completed': get_delivery(user_id, constants.DELIVERY, constants.COMPLETED),
            'Processing': get_delivery(user_id, constants.DELIVERY, constants.PROCESSING),
            'Shipping': get_delivery(user_id, constants.DELIVERY, constants.SHIPPING),
            'Delivered': get_delivery(user_id, constants.DELIVERY, constants.DELIVERED),
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
    
def get_delivery(user_id, type, status):
    return order_product.objects.filter(product__shop_id__manager_id__user_id=user_id, order__type=type, status=status, DeleteFlag='0')\
              .values('product_id__name', 'order__call', 'amount', 'order__order_no', 'status', 'order__transport_no', 'order__date', 'id')

def check_order_status(id):
    order_id=order_product.objects.filter(id=id).values('order_id')
    product_status=order_product.objects.filter(order_id=order_id[0]['order_id']).values_list('status', flat=True)

    isCompleted=True

    for i in product_status:
        if i != constants.COMPLETED:
            isCompleted=False
            break

    if isCompleted is False:
        return

    # 모든 order-product의 status가 COMPLETED가 되면 order status를 COMPLTETED로 변경
    order.objects.filter(id=order_id[0]['order_id']).update(
        status=constants.COMPLETED
    )    