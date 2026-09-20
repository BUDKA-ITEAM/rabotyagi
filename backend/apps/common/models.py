import uuid

from django.db import models


class BaseModel(models.Model):
    """Базовая модель: UUID вместо числового ID и метки времени."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField("создано", auto_now_add=True)
    updated_at = models.DateTimeField("обновлено", auto_now=True)

    class Meta:
        abstract = True