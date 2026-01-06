from __future__ import annotations

from rest_framework.permissions import BasePermission, SAFE_METHODS


def get_user_role(user) -> str | None:
    """Best-effort role inference based on which profile row exists.

    Keep this consistent with users.views.get_user_role.
    """
    if not user or not user.is_authenticated:
        return None

    if getattr(user, "is_superuser", False) or getattr(user, "is_staff", False):
        return "admin"

    # Default reverse accessor names (lowercased model names)
    if hasattr(user, "adminprofile"):
        return "admin"
    if hasattr(user, "manager"):
        return "manager"
    if hasattr(user, "chef"):
        return "chef"
    if hasattr(user, "waiter"):
        return "waiter"

    # Customer uses explicit related_name="customer_profile"
    if hasattr(user, "customer_profile"):
        return "customer"

    return None


class RoleRequired(BasePermission):
    """Generic role gate.

    Usage:
      permission_classes = [RoleRequired.with_roles("admin", "manager")]
    """

    allowed_roles: set[str] = set()

    @classmethod
    def with_roles(cls, *roles: str):
        class _RoleRequired(RoleRequired):
            allowed_roles = set(roles)

        return _RoleRequired

    def has_permission(self, request, view):
        role = get_user_role(request.user)
        return role in self.allowed_roles


class ReadOnlyOrRoles(BasePermission):
    """Allows read-only for everyone authenticated, and write for specific roles."""

    allowed_write_roles: set[str] = set()

    @classmethod
    def with_write_roles(cls, *roles: str):
        class _ReadOnlyOrRoles(ReadOnlyOrRoles):
            allowed_write_roles = set(roles)

        return _ReadOnlyOrRoles

    def has_permission(self, request, view):
        # Require auth for all actions (including read)
        if not request.user or not request.user.is_authenticated:
            return False

        if request.method in SAFE_METHODS:
            return True

        role = get_user_role(request.user)
        return role in self.allowed_write_roles


class IsOwnerCustomerOrStaff(BasePermission):
    """Object-level permission:

    - staff (admin/manager/waiter/chef) can access.
    - customer can access only if obj.customer.user == request.user
    """

    staff_roles = {"admin", "manager", "waiter", "chef"}

    def has_object_permission(self, request, view, obj):
        role = get_user_role(request.user)
        if role in self.staff_roles:
            return True
        if role == "customer":
            customer = getattr(obj, "customer", None)
            return bool(customer and getattr(customer, "user", None) == request.user)
        return False
