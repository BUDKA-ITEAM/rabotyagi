from rest_framework.permissions import BasePermission


class _RolePermission(BasePermission):
    role = None

    def has_permission(self, request, view):
        user = request.user
        return bool(user and user.is_authenticated and user.role == self.role)


class IsClient(_RolePermission):
    role = "client"
    message = "Действие доступно только клиентам."


class IsMaster(_RolePermission):
    role = "master"
    message = "Действие доступно только мастерам."