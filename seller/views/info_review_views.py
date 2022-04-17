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
        context['reviews'] = comment.objects.filter(product_id__shop_id__manager_id__user_id=request.user.id).values('id', 'memeber__mem_name', 'product__name', 'content', 'rate', 'created_at')
        #context['answered_questions'] = qna.objects.filter(product_id__shop_id__manager_id__user_id=request.user.id, answer_flag='1').values('id', 'member__mem_name', 'product__name', 'category__name', 'title', 'created_at', 'answer_flag')

        return render(request, self.template_name, context)

class ReviewPostView(LoginRequiredMixin, TemplateView):
    template_name = 'review_post.html'

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = {}
        review = get_review(kwargs.get('id'))

        context['review'] = review[0]
        #context['answer'] = list(comment.objects.filter(comment__id=kwargs.get('id')).values('id', 'content'))[0]

        return context

    def post(self, request: HttpRequest, **kwargs: Any) -> Dict[str, Any]:
        context = {}
        id = kwargs.get('id')
        content = request.POST.get('Content', None)

        if content is not None:
          comment.objects.create(
            content=content,
            comment_id=id
          )

        return redirect('/seller/review')

"""

class ReviewEditView(LoginRequiredMixin, View):
    template_name = 'review_post.html'

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
"""
def get_review(id):
    return list(comment.objects.filter(id=id).values('id', 'memeber__mem_name', 'product__name', 'content', 'rate', 'created_at'))
