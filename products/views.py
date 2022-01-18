from django.shortcuts import render
from django.views.generic.base import TemplateView

class PageView(TemplateView):
    template_name = 'test.html'