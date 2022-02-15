from django.http import HttpRequest, JsonResponse 
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View
import json

from management.models import order

class OrderView(View):
    template_name = 'order_info.html' 

    def get(self, request: HttpRequest, *args, **kwargs):
        context = {}
        context['orders'] = order.objects.values('order_no', 'type', 'status', 'name', 'call', 'code', 'address', 'member__mem_name', 'member__user__username', 'total_price', 'transport_no') 

        return render(request, self.template_name, context)

class GetDetail(View):

    def post(self, request:HttpRequest):
        context={}
        request.POST = json.loads(request.body)
        order_no = request.POST.get('order_no')

        context['success'] = True
        context['detail'] = list(order.objects.filter(order_no=order_no).values('order_no', 'type', 'status', 'name', 'call', 'code', 'address', 'member__mem_name', 'member__user__username', 'total_price', 'transport_no'))

        return JsonResponse(context, content_type="application/json")
