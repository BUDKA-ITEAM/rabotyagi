from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import extend_schema
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import AnonRateThrottle
from rest_framework_simplejwt.views import TokenObtainPairView

from . import services
from .serializers import LoginSerializer, LogoutSerializer, RegisterSerializer, UserSerializer


class AuthRateThrottle(AnonRateThrottle):
    """Ограничение попыток регистрации/входа. Лимит — DEFAULT_THROTTLE_RATES["auth"]."""

    scope = "auth"


class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = [AuthRateThrottle]

    @extend_schema(responses={201: OpenApiTypes.OBJECT})
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = services.register_user(**serializer.validated_data)
        payload = {"user": UserSerializer(user).data, **services.issue_tokens(user)}
        return Response(payload, status=status.HTTP_201_CREATED)


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
    throttle_classes = [AuthRateThrottle]


class LogoutView(generics.GenericAPIView):
    serializer_class = LogoutSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_classes = [AuthRateThrottle]

    @extend_schema(responses={204: None})
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        services.logout(refresh_token=serializer.validated_data["refresh"])
        return Response(status=status.HTTP_204_NO_CONTENT)


class MeView(generics.RetrieveUpdateAPIView):
    """Свой профиль: GET — посмотреть, PATCH — изменить имя, фамилию, e-mail."""

    serializer_class = UserSerializer
    http_method_names = ["get", "patch", "head", "options"]

    def get_object(self):
        return self.request.user