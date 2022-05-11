from django.http import HttpRequest, JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View
from django.contrib.auth.mixins import LoginRequiredMixin
from . import constants

from management.models import product, pro_subcategory

class ProductListView(LoginRequiredMixin, View):
    template_name='product_list.html'

    def get(self, request: HttpRequest):
        context = {
            'categories': pro_subcategory.objects.filter(DeleteFlag='0'),
            }

        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        
        return render(request, self.template_name, context)

class ProductstoppedView(LoginRequiredMixin, View):
    template_name='product_stopped.html'

    def get(self, request: HttpRequest):
        context = {
            'productsStopped': product.objects.filter(shop_id__manager_id__user_id=request.user.id, status=constants.STOPPED, DeleteFlag='0'),
            'categories': pro_subcategory.objects.filter(DeleteFlag='0'),
        }

        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        
        return render(request, self.template_name, context)

class ProductTableView(LoginRequiredMixin, View):
    '''
    판매자/상품관리

    Datatable에 넣을 데이터를 받아옵니다.
    '''
    def get(self, request: HttpRequest):
        user_id=request.user.id

        productsRequested = get_product(user_id, constants.REQUESTED)
        productsOnSale = get_product(user_id, constants.ONSALE)
        productsRejected = get_product(user_id, constants.REJECTED)
        productsStopped =get_product(user_id, constants.STOPPED)

        context = {
            'productsRequested': productsRequested,
            'productsOnSale': productsOnSale,
            'productsRejected': productsRejected,
            'productsStopped': productsStopped,
        }

        return JsonResponse(context, content_type='application/json')

def get_product(user_id, status):
    return list(product.objects.filter(shop_id__manager_id__user_id=user_id, status=status, DeleteFlag='0')\
              .values('id', 'pro_subcategory__name', 'name', 'price', 'status', 'stock'))
