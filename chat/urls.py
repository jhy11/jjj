from django.urls import path

from . import views
from .views import chat_views

app_name = 'chat'

urlpatterns=[

    #채팅 화면
    path('chat-page', chat_views.ChatView.as_view(), name='chat-page'),

]