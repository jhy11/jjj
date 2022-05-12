from django.http import HttpRequest, JsonResponse 
from django.shortcuts import render, redirect, get_object_or_404
from django.views.generic.base import View, TemplateView
from typing import Any, Dict
from datetime import datetime
from django.contrib.auth.mixins import LoginRequiredMixin

from management.models import qna, qna_category, qna_answer

class QnaView(LoginRequiredMixin, View):
    template_name = 'qna_info.html' 

    def get(self, request: HttpRequest, *args, **kwargs):
        context = {}
        if request.user.is_staff:
            context['staff'] = True
        if request.user.groups.filter(name='seller').exists():
            context['seller'] = True
        
        context['qnaCategories'] = qna_category.objects.values('name')
        context['qnas'] = qna.objects.values('id', 'member__mem_name', 'category__name', 'title', 'created_at', 'answer_flag')

        return render(request, self.template_name, context)

class QnaPostView(LoginRequiredMixin, TemplateView):
    template_name = 'qna-post.html'

    def get_context_data(self, **kwargs: Any) -> Dict[str, Any]:
        context = {}
        question = get_question(kwargs.get('id'))

        context['question'] = question[0]
        context['answer'] = list(qna_answer.objects.filter(qna__id=kwargs.get('id')).values('id', 'content'))[0]

        return context

    def post(self, request: HttpRequest, **kwargs: Any) -> Dict[str, Any]:
        context = {}
        id = kwargs.get('id')
        content = request.POST.get('Content', None)

        if content is not None:
          qna_answer.objects.create(
            content=content,
            qna_id=id
          )
          qna.objects.filter(id=id).update(
            answer_flag='1'
          )

        return redirect('/management/qna')

class QnaEditView(LoginRequiredMixin, View):
    template_name = 'qna-post.html'

    def post(self, request: HttpRequest, **kwargs: Any) -> Dict[str, Any]:
        context = {}
        id = kwargs.get('id')
        content = request.POST.get('Content', None)

        if content is not None:
          # update content of answer
          qna_answer.objects.filter(qna__id=id).update(
            content=content,
            updated_at=datetime.now(),
          )

        return redirect('/management/qna')
  
def get_question(id):
    return list(qna.objects.filter(id=id).values('id', 'member__mem_name', 'category__name', 'title', 'content', 'created_at', 'answer_flag'))