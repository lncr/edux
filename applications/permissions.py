from rest_framework import permissions


class IsOwnerOrStaff(permissions.BasePermission):
    """
    Custom permission: Only owner of the application or staff can edit/delete.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user or request.user.is_staff
