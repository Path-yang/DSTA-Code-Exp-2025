from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, UserProfile, UserStats


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Profile'


class UserStatsInline(admin.StackedInline):
    model = UserStats
    can_delete = False
    verbose_name_plural = 'Statistics'


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ('email', 'name', 'is_verified', 'is_active', 'created_at', 'last_login_at')
    list_filter = ('is_verified', 'is_active', 'created_at')
    search_fields = ('email', 'name')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('name', 'username')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'is_verified')}),
        ('Important dates', {'fields': ('last_login', 'date_joined', 'created_at', 'last_login_at')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'name', 'password1', 'password2'),
        }),
    )
    
    readonly_fields = ('created_at', 'last_login_at', 'date_joined')
    inlines = [UserProfileInline, UserStatsInline]


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone_number', 'location', 'avatar')
    search_fields = ('user__email', 'user__name', 'phone_number')
    list_filter = ('location',)


@admin.register(UserStats)
class UserStatsAdmin(admin.ModelAdmin):
    list_display = ('user', 'scans_completed', 'threats_detected', 'reports_submitted', 'forum_posts', 'member_since')
    search_fields = ('user__email', 'user__name')
    list_filter = ('member_since',)
    readonly_fields = ('member_since', 'last_activity')
    
    fieldsets = (
        ('User', {'fields': ('user',)}),
        ('Activity Stats', {
            'fields': ('scans_completed', 'threats_detected', 'reports_submitted', 'forum_posts')
        }),
        ('Timestamps', {'fields': ('member_since', 'last_activity')}),
    )
