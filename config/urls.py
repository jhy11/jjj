from django.contrib import admin
from django.urls import path, include 
from django.conf.urls.static import static
from django.conf import settings
from config.views import index, LoginView, RegisterView, CheckSameId, CheckSameEmail
from django.contrib.auth.views import LogoutView
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('', index.as_view(), name='index'),

    path('login', LoginView.as_view(), name='login'),
    path('register', RegisterView.as_view(), name='register'),
    path('check-same-id', CheckSameId.as_view(), name='check-same-id'),
    path('check-same-email', CheckSameEmail.as_view(), name='check-same-email'),
    path('logout',LogoutView.as_view(next_page='./'), name='logout'),
    
    path('products/', include('products.urls')),
    path('management/', include('management.urls')),
    path('seller/', include('seller.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_URL)

