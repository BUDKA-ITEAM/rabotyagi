from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework import exceptions, serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from apps.common.utils import normalize_phone

from .models import User, UserRole


class UserSerializer(serializers.ModelSerializer):
    """Профиль пользователя. Менять можно только имя, фамилию и e-mail."""

    class Meta:
        model = User
        fields = ("id", "phone", "first_name", "last_name", "email", "role", "phone_verified", "created_at")
        read_only_fields = ("id", "phone", "role", "phone_verified", "created_at")

    def validate_email(self, value):
        return value or None  # пустая строка -> NULL, иначе сломается unique


class RegisterSerializer(serializers.Serializer):
    phone = serializers.CharField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)
    first_name = serializers.CharField(max_length=150)
    role = serializers.ChoiceField(choices=UserRole.choices)

    def validate_phone(self, value):
        try:
            phone = normalize_phone(value)
        except ValueError as exc:
            raise serializers.ValidationError(str(exc))
        if User.objects.filter(phone=phone).exists():
            raise serializers.ValidationError("Пользователь с таким телефоном уже зарегистрирован.")
        return phone

    def validate(self, attrs):
        candidate = User(phone=attrs["phone"], first_name=attrs["first_name"])
        try:
            validate_password(attrs["password"], candidate)
        except DjangoValidationError as exc:
            raise serializers.ValidationError({"password": list(exc.messages)})
        return attrs


class LoginSerializer(TokenObtainPairSerializer):
    """Вход по телефону и паролю. В токен добавляется роль, в ответ — профиль."""

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["role"] = user.role  # её читает Go-сервис чата
        return token

    def validate(self, attrs):
        field = self.username_field  # "phone"
        try:
            attrs[field] = normalize_phone(attrs.get(field, ""))
        except ValueError:
            # тот же ответ, что и при неверном пароле: не раскрываем, какие номера есть в базе
            raise exceptions.AuthenticationFailed(
                self.error_messages["no_active_account"], "no_active_account"
            )
        data = super().validate(attrs)
        data["user"] = UserSerializer(self.user).data
        return data


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()