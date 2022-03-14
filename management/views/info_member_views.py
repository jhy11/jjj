from django.http.request import QueryDict
from typing import Any, Dict
from django.http import HttpRequest, JsonResponse 
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View

from management.models import member, membership, shop
from django.contrib.auth.mixins import LoginRequiredMixin

class MemberView(LoginRequiredMixin, View):
    template_name = 'member_info.html' 

    def get(self, request: HttpRequest, *args, **kwargs):
        context = {}
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
            
        context['members'] = member.objects.values('id', 'mem_level__level', 'user__username', 'mem_name', 'mem_phone', 'user__email', 'user__date_joined', 'mem_point') 
        context['levels'] = membership.objects.values('level')
        
        return render(request, self.template_name, context)
    
    def put(self, request:HttpRequest):
        context={}

        return JsonResponse(context, content_type="application/json")