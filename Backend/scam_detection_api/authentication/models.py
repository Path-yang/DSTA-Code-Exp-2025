from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    """Custom User model with email as username field"""
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=100)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(default=timezone.now)
    last_login_at = models.DateTimeField(null=True, blank=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']
    
    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        # Set username to email if not provided
        if not self.username:
            self.username = self.email
        super().save(*args, **kwargs)


class UserProfile(models.Model):
    """Extended user profile information"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    location = models.CharField(max_length=100, blank=True)
    avatar = models.CharField(max_length=10, default='👨‍💻')  # Emoji avatar
    notification_preferences = models.JSONField(default=dict)
    
    def __str__(self):
        return f"{self.user.name}'s Profile"


class UserStats(models.Model):
    """User activity statistics for the scam detection app"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='stats')
    scans_completed = models.IntegerField(default=0)
    threats_detected = models.IntegerField(default=0)
    reports_submitted = models.IntegerField(default=0)
    forum_posts = models.IntegerField(default=0)
    member_since = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.user.name}'s Stats"
    
    class Meta:
        verbose_name_plural = "User Stats"


# Signal to create profile and stats when user is created
from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile_and_stats(sender, instance, created, **kwargs):
    """Automatically create UserProfile and UserStats when User is created"""
    if created:
        UserProfile.objects.create(user=instance)
        UserStats.objects.create(user=instance)
