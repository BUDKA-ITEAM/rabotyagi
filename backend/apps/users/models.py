from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator
from django.db import models

from apps.common.models import BaseModel
from apps.common.utils import normalize_phone


class UserRole(models.TextChoices):
    CLIENT = "client", "Клиент"
    MASTER = "master", "Мастер"


class UserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, phone, password, **extra_fields):
        if not phone:
            raise ValueError("Телефон обязателен.")
        user = self.model(phone=normalize_phone(phone), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, phone, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(phone, password, **extra_fields)

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("phone_verified", True)
        if not extra_fields["is_staff"] or not extra_fields["is_superuser"]:
            raise ValueError("У суперпользователя is_staff и is_superuser должны быть True.")
        return self._create_user(phone, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin, BaseModel):
    phone = models.CharField(
        "телефон",
        max_length=16,
        unique=True,
        validators=[
            RegexValidator(
                r"^\+[1-9]\d{9,14}$",
                "Телефон должен быть в международном формате, например +79991234567.",
            )
        ],
    )
    email = models.EmailField("e-mail", unique=True, null=True, blank=True)
    first_name = models.CharField("имя", max_length=150)
    last_name = models.CharField("фамилия", max_length=150, blank=True)
    role = models.CharField("роль", max_length=10, choices=UserRole.choices, default=UserRole.CLIENT)
    phone_verified = models.BooleanField("телефон подтверждён", default=False)

    is_active = models.BooleanField("активен", default=True)
    is_staff = models.BooleanField("доступ в админку", default=False)

    objects = UserManager()

    USERNAME_FIELD = "phone"
    REQUIRED_FIELDS = ["first_name"]

    class Meta:
        verbose_name = "пользователь"
        verbose_name_plural = "пользователи"
        ordering = ["-created_at"]

    def __str__(self):
        return self.phone

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip()

    def get_short_name(self):
        return self.first_name