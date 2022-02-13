import json
from django.http.request import QueryDict
from typing import Any, Dict
from django.http import HttpRequest, JsonResponse 
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View

from config.models import member


class MemberView(View):
    template_name = 'member_info.html' 

    def get(self, request: HttpRequest, *args, **kwargs):
        context = {}
        context['members'] = member.objects.values('id', 'mem_authority', 'user_id__username', 'mem_name', 'mem_phone', 'user_id__email', 'address','user_id__date_joined', 'mem_point') 

        return render(request, self.template_name, context)