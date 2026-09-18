from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("apps.users.urls")),
    path("api/v1/", include("apps.catalog.urls")),
    path("api/v1/", include("apps.profiles.urls")),
    path("api/v1/", include("apps.orders.urls")),
    path("api/v1/", include("apps.offers.urls")),
    path("api/v1/", include("apps.reviews.urls")),
    path("api/v1/", include("apps.notifications.urls")),
    path("api/v1/", include("apps.moderation.urls")),
    path("internal/", include("apps.internal.urls")),
]
