from django.db import IntegrityError, transaction
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken

from apps.common.exceptions import ConflictError, ServiceError

from .models import User
from .serializers import LoginSerializer


def register_user(*, phone: str, password: str, first_name: str, role: str) -> User:
    """Создаёт пользователя. Телефон уже должен быть нормализован."""
    try:
        # savepoint: при ATOMIC_REQUESTS=True ошибка БД не ломает всю транзакцию запроса
        with transaction.atomic():
            return User.objects.create_user(
                phone=phone, password=password, first_name=first_name, role=role
            )
    except IntegrityError as exc:  # гонка: два запроса с одним номером одновременно
        raise ConflictError("Пользователь с таким телефоном уже зарегистрирован.") from exc


def issue_tokens(user: User) -> dict:
    """Выдаёт пару токенов с той же ролью в claims, что и при логине."""
    refresh = LoginSerializer.get_token(user)
    return {"access": str(refresh.access_token), "refresh": str(refresh)}


def logout(*, refresh_token: str) -> None:
    """Отзывает refresh-токен (добавляет в чёрный список)."""
    try:
        RefreshToken(refresh_token).blacklist()
    except TokenError as exc:
        raise ServiceError("Некорректный или уже отозванный refresh-токен.") from exc