"""Локальная разработка."""
from .base import *

DEBUG = True
ALLOWED_HOSTS = ["*"]

# любой фронт с любого порта
CORS_ALLOW_ALL_ORIGINS = True

# письма в консоль
EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"

# браузерный интерфейс DRF + без лимитов запросов
REST_FRAMEWORK = {
    **REST_FRAMEWORK,
    "DEFAULT_RENDERER_CLASSES": [
        "rest_framework.renderers.JSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ],
    "DEFAULT_THROTTLE_CLASSES": [],
}

# токен для го-сервиса чата по умолчанию (в .env можно переопределить)
if not INTERNAL_SERVICE_TOKEN:
    INTERNAL_SERVICE_TOKEN = "dev-internal-token"


DATABASES["default"].setdefault("OPTIONS", {})["connect_timeout"] = 5