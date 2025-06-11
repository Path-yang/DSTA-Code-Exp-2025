"""
URL configuration for scam_detection_api project.

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
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request):
    """API root endpoint with available endpoints"""
    return Response({
        'message': 'Scam Detection API v1.0',
        'endpoints': {
            'authentication': {
                'health': '/api/auth/health/',
                'register': '/api/auth/register/',
                'login': '/api/auth/login/',
                'logout': '/api/auth/logout/',
                'refresh_token': '/api/auth/token/refresh/',
                'user_info': '/api/auth/me/',
                'update_profile': '/api/auth/profile/update/',
                'change_password': '/api/auth/password/change/',
                'user_stats': '/api/auth/stats/',
                'update_stats': '/api/auth/stats/update/',
            }
        },
        'documentation': 'Visit /admin/ for admin interface'
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api_root, name='api_root'),
    path('api/auth/', include('authentication.urls')),
]
