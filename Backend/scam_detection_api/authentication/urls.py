from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

app_name = 'authentication'

urlpatterns = [
    # Health check
    path('health/', views.health_check, name='health_check'),
    
    # Authentication endpoints
    path('register/', views.register_user, name='register'),
    path('login/', views.CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', views.logout_user, name='logout'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # User profile endpoints
    path('me/', views.get_user_info, name='user_info'),
    path('profile/update/', views.update_user_profile, name='update_profile'),
    path('password/change/', views.change_password, name='change_password'),
    path('account/delete/', views.delete_account, name='delete_account'),
    
    # User stats endpoints
    path('stats/', views.get_user_stats, name='user_stats'),
    path('stats/update/', views.update_user_stats, name='update_stats'),
] 