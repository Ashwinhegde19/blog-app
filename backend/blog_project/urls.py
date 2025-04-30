"""
URL configuration for blog_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.reverse import reverse

@api_view(['GET'])
def api_root(request, format=None):
    """
    Root endpoint that provides API documentation and available endpoints.
    """
    return Response({
        'admin': reverse('admin:index', request=request, format=format),
        'api_blog': request.build_absolute_uri('/api/blog/posts/'),
        'api_users': request.build_absolute_uri('/api/users/'),
        'api_auth': request.build_absolute_uri('/api/users/token/'),
        'api_register': request.build_absolute_uri('/api/users/register/'),
        'message': 'Welcome to the Blog API. Use the endpoints above to interact with the API.',
        'documentation': 'This is the backend API for the Blog application.',
        'status': 'API is running properly.'
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('admin/', admin.site.urls),
    path('api/blog/', include('blog.urls')),
    path('api/users/', include('users.urls')),
    path('api-auth/', include('rest_framework.urls')),
]
