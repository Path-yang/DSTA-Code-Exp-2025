from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import User, UserProfile, UserStats


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ('email', 'name', 'password', 'password_confirm')
    
    def validate_email(self, value):
        """Check if email already exists"""
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def validate(self, attrs):
        """Validate password confirmation"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        """Create new user with profile and stats"""
        validated_data.pop('password_confirm')
        
        user = User.objects.create_user(
            username=validated_data['email'],
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password']
        )
        
        return user


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login"""
    email = serializers.EmailField()
    password = serializers.CharField()
    
    def validate(self, attrs):
        """Validate login credentials"""
        email = attrs.get('email')
        password = attrs.get('password')
        
        if email and password:
            user = authenticate(username=email, password=password)
            if not user:
                raise serializers.ValidationError('Invalid email or password.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError('Must include email and password.')


class UserStatsSerializer(serializers.ModelSerializer):
    """Serializer for user statistics"""
    class Meta:
        model = UserStats
        fields = [
            'scans_completed', 
            'threats_detected', 
            'reports_submitted', 
            'forum_posts', 
            'member_since', 
            'last_activity'
        ]
        read_only_fields = ['member_since', 'last_activity']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile"""
    class Meta:
        model = UserProfile
        fields = [
            'phone_number', 
            'date_of_birth', 
            'location', 
            'avatar', 
            'notification_preferences'
        ]


class UserInfoSerializer(serializers.ModelSerializer):
    """Complete user information serializer"""
    stats = UserStatsSerializer(read_only=True)
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = [
            'id', 
            'email', 
            'name', 
            'is_verified', 
            'created_at', 
            'last_login_at',
            'stats', 
            'profile'
        ]
        read_only_fields = ['id', 'email', 'is_verified', 'created_at', 'last_login_at']


class UpdateUserProfileSerializer(serializers.ModelSerializer):
    """Serializer for updating user profile"""
    name = serializers.CharField(source='user.name')
    
    class Meta:
        model = UserProfile
        fields = ['name', 'phone_number', 'location', 'avatar']
    
    def update(self, instance, validated_data):
        """Update both user and profile"""
        user_data = validated_data.pop('user', {})
        if 'name' in user_data:
            instance.user.name = user_data['name']
            instance.user.save()
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        return instance 