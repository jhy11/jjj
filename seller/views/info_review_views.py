from django.http import HttpRequest, JsonResponse 
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View, TemplateView
from typing import Any, Dict
from datetime import datetime
from django.contrib.auth.mixins import LoginRequiredMixin

from management.models import comment,comment_reply


class ReviewView(LoginRequiredMixin, View):
    template_name = 'review_info.html' 

    def get(self, request: HttpRequest, *args, **kwargs):
        context = {}
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        context['reviews'] = comment.objects.filter(orderproduct_id__product_id__shop_id__manager_id__user_id=request.user.id).values('id', 'member__mem_name', 'orderproduct__product__name', 'content', 'rate', 'created_at','comment_img','reply_flag')
        context['answered_questions'] = comment.objects.filter(orderproduct_id__product_id__shop_id__manager_id__user_id=request.user.id, reply_flag='1').values('id', 'member__mem_name', 'orderproduct__product__name', 'content', 'rate', 'created_at','comment_img','reply_flag')

        return render(request, self.template_name, context)

class ReviewPostView(LoginRequiredMixin, TemplateView):
    template_name = 'review_post.html'

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = {}
        if self.request.user.is_staff:
            context['staff'] = True
        if self.request.user.groups.filter(name='seller').exists():
            context['seller'] = True
      
        #review = get_review(kwargs.get('id'), self.request.user.id)
        #context['review'] = review[0]
        id = kwargs.get('id')
        context['review'] = comment.objects.get(id=id)
        content = list(comment.objects.filter(id=kwargs.get('id')).values('reply_flag'))[0]
        reply_flag = content['reply_flag']
        if reply_flag == '1':
            context['answer'] = list(comment_reply.objects.filter(comment_id=kwargs.get('id')).values('id', 'content'))[0]
        else:
            pass
        return context

    def post(self, request: HttpRequest, **kwargs: Any) -> Dict[str, Any]:
        context = {}
        id = kwargs.get('id')
        content = request.POST.get('Content', None)

        if content is not None:
          comment_reply.objects.create(
            content=content,
            comment_id=id
          )
          comment.objects.filter(id=id).update(
            reply_flag='1'
          )

        return redirect('/seller/review')



class ReviewEditView(LoginRequiredMixin, View):
    template_name = 'review_post.html'

    def post(self, request: HttpRequest, **kwargs: Any) -> Dict[str, Any]:
        context = {}
        id = kwargs.get('id')
        content = request.POST.get('Content', None)

        if content is not None:
          # update content of answer
          comment_reply.objects.filter(id=id).update(
            content=content,
            updated_at=datetime.now(),
          )

        return redirect('/seller/review')

def get_review(id, user_id):
    return list(comment.objects.filter(id=id).values('id', 'member__mem_name', 'orderproduct__product__name', 'content', 'rate', 'created_at','comment_img','reply_flag'))