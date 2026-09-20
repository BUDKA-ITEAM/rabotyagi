import re

_PHONE_SEPARATORS_RE = re.compile(r"[\s\-().]")
_RU_LOCAL_RE = re.compile(r"[78]\d{10}")
_E164_RE = re.compile(r"\+[1-9]\d{9,14}")


def normalize_phone(raw: str) -> str:
    """Приводит телефон к формату E.164: '8 (999) 123-45-67' -> '+79991234567'.

    Номера из 11 цифр, начинающиеся с 7 или 8 (без плюса), считаются российскими.
    Остальные номера нужно вводить с плюсом и кодом страны.
    Бросает ValueError, если номер некорректен.
    """
    value = _PHONE_SEPARATORS_RE.sub("", (raw or "").strip())
    if _RU_LOCAL_RE.fullmatch(value):
        value = "+7" + value[1:]
    if not _E164_RE.fullmatch(value):
        raise ValueError(
            "Введите номер телефона в международном формате, например +79991234567."
        )
    return value