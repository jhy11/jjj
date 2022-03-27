from django.http import HttpRequest
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View
from django.contrib.auth.mixins import LoginRequiredMixin

from management.models import product, pro_category

class ProductListView(LoginRequiredMixin, View):
    template_name='product_list.html'

    def get(self, request: HttpRequest):
        context = {
            'productsOnSale': product.objects.filter(shop_id__manager_id__user_id=request.user.id, status='1', DeleteFlag='0'),
            'categories': pro_category.objects.filter(DeleteFlag='0'),
            }

        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        
        return render(request, self.template_name, context)
