from rest_framework import exceptions, status
from rest_framework.views import exception_handler as drf_exception_handler


class ServiceError(exceptions.APIException):
    """ошибка бизнес-логики. Её можно бросать из services.py."""

    status_code = status.HTTP_400_BAD_REQUEST
    default_detail = "Не удалось выполнить действие."
    default_code = "service_error"


class ConflictError(ServiceError):
    status_code = status.HTTP_409_CONFLICT
    default_detail = "Конфликт с текущим состоянием данных."
    default_code = "conflict"


_FALLBACK_CODES = {
    401: "authentication_failed",
    403: "permission_denied",
    404: "not_found",
}


def custom_exception_handler(exc, context):
    """Единый формат ошибок:

    {"error": {"code": "...", "message": "...", "details": {...} | null}}
    """
    response = drf_exception_handler(exc, context)
    if response is None:
        return None

    if isinstance(exc, exceptions.ValidationError):
        error = {
            "code": "validation_error",
            "message": "Проверьте правильность введённых данных.",
            "details": response.data,
        }
    else:
        data = response.data
        detail = data.get("detail") if isinstance(data, dict) else None
        code = exc.get_codes() if isinstance(exc, exceptions.APIException) else None
        error = {
            "code": code if isinstance(code, str) else _FALLBACK_CODES.get(response.status_code, "error"),
            "message": str(detail) if detail else "Ошибка запроса.",
            "details": None,
        }

    response.data = {"error": error}
    return response