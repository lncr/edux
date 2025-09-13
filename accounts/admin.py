from django.contrib import admin

from django.contrib.auth import get_user_model
from .models import Profile

User = get_user_model()


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "is_staff", "is_active")
    search_fields = ("email",)
    list_filter = ("is_staff", "is_active")


@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user", )
    search_fields = ("user__email", )