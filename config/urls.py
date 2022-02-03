from django.contrib import admin
from django.urls import path, include 
from django.conf.urls.static import static
from django.conf import settings
from config.views import index

urlpatterns = [
    path('admin/', admin.site.urls),
    
    path('', index.as_view()),
    path('products/', include('products.urls')),
    path('management/', include('management.urls')),
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_URL)

