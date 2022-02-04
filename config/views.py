from django.views.generic import View
from django.http import HttpRequest, JsonResponse
from django.shortcuts import redirect, render


class index(View):
    def get(self, request: HttpRequest, *args, **kwargs):
        context = {}
        
        return render(request, 'index.html', context)

