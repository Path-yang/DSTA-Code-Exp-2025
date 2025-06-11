from django.shortcuts import render
from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import update_session_auth_hash
from django.utils import timezone

from .models import User, UserProfile, UserStats
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserInfoSerializer,
    UpdateUserProfileSerializer,
    UserStatsSerializer
)


class CustomTokenObtainPairView(TokenObtainPairView):
    """Custom JWT token view with additional user data"""
    serializer_class = UserLoginSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Update last login time
        user.last_login_at = timezone.now()
        user.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        # Return tokens with user data
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserInfoSerializer(user).data
        }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Register a new user"""
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Generate tokens for the new user
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': 'User registered successfully',
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': UserInfoSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_info(request):
    """Get current user's complete information"""
    user = request.user
    serializer = UserInfoSerializer(user)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """Update user profile information"""
    user = request.user
    profile = user.profile
    
    serializer = UpdateUserProfileSerializer(
        profile, 
        data=request.data, 
        partial=request.method == 'PATCH'
    )
    
    if serializer.is_valid():
        serializer.save()
        
        # Return updated user info
        user_serializer = UserInfoSerializer(user)
        return Response({
            'message': 'Profile updated successfully',
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_stats(request):
    """Get user's activity statistics"""
    user = request.user
    stats = user.stats
    serializer = UserStatsSerializer(stats)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_user_stats(request):
    """Update user statistics (for app activity tracking)"""
    user = request.user
    stats = user.stats
    
    # Update specific stats based on request data
    if 'scans_completed' in request.data:
        stats.scans_completed += int(request.data.get('scans_completed', 0))
    
    if 'threats_detected' in request.data:
        stats.threats_detected += int(request.data.get('threats_detected', 0))
    
    if 'reports_submitted' in request.data:
        stats.reports_submitted += int(request.data.get('reports_submitted', 0))
    
    if 'forum_posts' in request.data:
        stats.forum_posts += int(request.data.get('forum_posts', 0))
    
    stats.save()
    
    serializer = UserStatsSerializer(stats)
    return Response({
        'message': 'Stats updated successfully',
        'stats': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    """Change user password"""
    user = request.user
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')
    
    if not old_password or not new_password:
        return Response({
            'error': 'Both old_password and new_password are required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not user.check_password(old_password):
        return Response({
            'error': 'Old password is incorrect'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    user.set_password(new_password)
    user.save()
    
    return Response({
        'message': 'Password changed successfully'
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """Logout user by blacklisting refresh token"""
    try:
        refresh_token = request.data.get('refresh_token')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        
        return Response({
            'message': 'Logged out successfully'
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        return Response({
            'error': 'Invalid token'
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_account(request):
    """Delete user account (deactivate)"""
    user = request.user
    password = request.data.get('password')
    
    if not password:
        return Response({
            'error': 'Password confirmation required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    if not user.check_password(password):
        return Response({
            'error': 'Incorrect password'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Deactivate instead of delete to preserve data integrity
    user.is_active = False
    user.save()
    
    return Response({
        'message': 'Account deactivated successfully'
    }, status=status.HTTP_200_OK)


# Health check endpoint
@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """API health check"""
    return Response({
        'status': 'healthy',
        'message': 'Scam Detection API is running',
        'version': '1.0.0'
    }, status=status.HTTP_200_OK)
