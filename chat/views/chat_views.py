from itertools import count
from django.http import HttpRequest
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View

from management.models import shop

class ChatView(View):
    template_name='chat_testing.html'

    def get(self, request: HttpRequest):
        context={}
        Shop = shop.objects.get(manager__user__id=request.user.id)
        
        shopcnt = shop.objects.count() # 현재 28
        print(shopcnt)

        context['shop'] = Shop
        
        return render(request, self.template_name, context=context)
