"""ПРОД"""

import os
from django.core.exceptions import ImproperlyConfigured
from .base import *

DEBUG = False

# обязательные переменные(без них капут)
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS")
CSRF_TRUSTED_ORIGINS = env.list("CSRF_TRUSTED_ORIGINS", default=[])

if not INTERNAL_SERVICE_TOKEN:
    raise ImproperlyConfigured("INTERNAL_SERVICE_TOKEN должен быть в проде")
if "JWT_SIGNING_KEY" not in os.environ:
    raise ImproperlyConfigured("JWT_SINING_KEY должен быть в проде")



# секурити
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_SSL_REDIRECT = env.bool("SECURE_SSL_REDIRECT", default=True)
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_HSTS_SECONDS = env.int("SECURE_HITS_SECONDS", default= 60 * 60 * 24 * 30)
SECURE_HSTS_INCLUDE_SUBDOMAINS = False
SECURE_REFERRER_POLICY = "same-origin"


# соединение с бд открытое
DATABASES["default"]["CONN_MAX_AGE"] = env.int("CONN_MAX_AGE", default=60)



#drf
REST_FRAMEWORK = {
    **REST_FRAMEWORK,
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
}


#файлы в s3(если когда-то уйдет в прод)
if env.bool("USE-S3", default=False):
    STORAGES["default"] = {
        "BACKEND": "storages.backend.s3.S3Storage",
        "OPTIONS": {
            "bucket_name": env("S3_BUCKET"),
            "endpoint_url": env("S3_ENDPOINT_URL"),
            "access_key": env("S3_ACCESS_KEY"),
            "secret_key": env("S3_SECRET_KEY"),
            "region_name": env("S3_REGION", default=None),
            "custom_domain": env("S3_CUSTOM_DOMAIN", default=None),
            "default_acl": None,
            "filer_overwrite": False,
        },
    }