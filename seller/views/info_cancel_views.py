import json
from django.http import HttpRequest, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View
from django.contrib.auth.mixins import LoginRequiredMixin
from . import constants

from management.models import order_product, order

class CancelView(LoginRequiredMixin, View):
    template_name='cancel.html'

    def get(self, request: HttpRequest):
        context={}

        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        
        return render(request, self.template_name, context)

class CancelTableView(LoginRequiredMixin, View):
    '''
    판매자/판매관리/취소 관리

    Datatable에 넣을 데이터를 받아옵니다.
    '''
    def get(self, request: HttpRequest):
        user_id=request.user.id

        CancelRequested = get_cancellation(user_id, constants.CANCEL_RECEIVED),
        CancelProcessing = get_cancellation(user_id, constants.CANCEL_PROCESSING),
        Canceled = get_cancellation(user_id, constants.CANCELED),

        cancel=[] 
        canceled=[]

        cancel.extend(CancelRequested)
        cancel.extend(CancelProcessing)
        canceled.extend(Canceled)

        context = {
            'cancel': cancel,
            'canceled': canceled,
        }
        return JsonResponse(context, content_type='application/json')
      
    def put(self, request: HttpRequest):
        context={}
        request.PUT = json.loads(request.body)

        Id = request.PUT.get('id')

        order_product.objects.filter(id=Id).update(
            status=constants.CANCEL_PROCESSING
        )
        check_order_status(Id)

        context['success']=True

        return JsonResponse(context, content_type='application/json')

def get_cancellation(user_id, status):
    return list(order_product.objects.filter(product__shop_id__manager_id__user_id=user_id, status=status, DeleteFlag='0')\
              .values('product_id__name', 'order__call', 'amount', 'order__order_no', 'status', 'order__transport_no', 'order__date', 'id', 'order__type', 'status'))

def check_order_status(id):
    order_id=order_product.objects.filter(id=id).values('order_id')
    product_status=order_product.objects.filter(order_id=order_id[0]['order_id']).values_list('status', flat=True)
    product_id=order_product.objects.filter(order_id=order_id[0]['order_id']).values_list('id', flat=True)
    isCompleted=True

    for i in product_status:
        if i != constants.CANCEL_PROCESSING:
            isCompleted=False
            break

    if isCompleted is False:
        return

    # 모든 order-product의 status가 CANCEL_PROCESSING이 되면 order status를 CANCELED로 변경
    order.objects.filter(id=order_id[0]['order_id']).update(
        status=constants.CANCELED
    )
    # 모든 order-product status를 CANCELD로 변경
    for i in product_id:
      print(i)
      order_product.objects.filter(id=i).update(
          status=constants.CANCELED
      )