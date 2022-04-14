from django.http import HttpRequest, JsonResponse 
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View, TemplateView
from typing import Any, Dict
from datetime import datetime
from django.contrib.auth.mixins import LoginRequiredMixin

from management.models import comment

class ReviewView(LoginRequiredMixin, View):
    template_name = 'review_info.html' 

    def get(self, request: HttpRequest, *args, **kwargs):
        context = {}
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True

        context['reviews'] = comment.objects.values('id', 'member__mem_name', 'product__name', 'content', 'rate')

        return render(request, self.template_name, context)

"""
class ReviewPostView(LoginRequiredMixin, TemplateView):
    template_name = 'review-post.html'

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = {}
        question = get_question(kwargs.get('id'))

        context['question'] = question[0]
        context['answer'] = list(review_answer.objects.filter(review__id=kwargs.get('id')).values('id', 'content'))[0]

        return context

    def post(self, request: HttpRequest, **kwargs: Any) -> Dict[str, Any]:
        context = {}
        id = kwargs.get('id')
        content = request.POST.get('Content', None)

        if content is not None:
          review_answer.objects.create(
            content=content,
            review_id=id
          )
          review.objects.filter(id=id).update(
            answer_flag='1'
          )

        return redirect('/seller/review')


class ReviewEditView(LoginRequiredMixin, View):
    template_name = 'review-post.html'

    def post(self, request: HttpRequest, **kwargs: Any) -> Dict[str, Any]:
        context = {}
        id = kwargs.get('id')
        content = request.POST.get('Content', None)

        if content is not None:
          # update content of answer
          comment.objects.filter(id=id).update(
            content=content,
            updated_at=datetime.now(),
          )

        return redirect('/seller/review')
  
#def get_question(id):
    #return list(review.objects.filter(id=id).values('id', 'member__mem_name', 'product__name', 'category__name', 'title', 'content', 'created_at', 'answer_flag'))'''
"""