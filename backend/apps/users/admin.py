from django import forms
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.forms import UserChangeForm, UserCreationForm

from apps.common.utils import normalize_phone

from .models import User


class UserAdminCreationForm(UserCreationForm):
    class Meta:
        model = User
        fields = ("phone", "first_name", "role")

    def clean_phone(self):
        try:
            return normalize_phone(self.cleaned_data["phone"])
        except ValueError as exc:
            raise forms.ValidationError(str(exc))


class UserAdminChangeForm(UserChangeForm):
    class Meta:
        model = User
        fields = "__all__"


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    form = UserAdminChangeForm
    add_form = UserAdminCreationForm

    ordering = ("-created_at",)
    list_display = ("phone", "first_name", "last_name", "role", "phone_verified", "is_active", "is_staff", "created_at")
    list_filter = ("role", "phone_verified", "is_active", "is_staff")
    search_fields = ("phone", "first_name", "last_name", "email")
    readonly_fields = ("last_login", "created_at", "updated_at")

    fieldsets = (
        (None, {"fields": ("phone", "password")}),
        ("Личные данные", {"fields": ("first_name", "last_name", "email", "role", "phone_verified")}),
        ("Права", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Даты", {"fields": ("last_login", "created_at", "updated_at")}),
    )
    add_fieldsets = (
        (None, {"classes": ("wide",), "fields": ("phone", "first_name", "role", "password1", "password2")}),
    )