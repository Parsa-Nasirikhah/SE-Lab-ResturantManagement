from __future__ import annotations

from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

from .models import Customer
from .serializers import RegisterSerializer

from .models import User, Chef, Waiter, Manager, AdminProfile


def get_user_role(user) -> str:
    if not user or not user.is_authenticated:
        return "anonymous"

    if getattr(user, "is_superuser", False) or getattr(user, "is_staff", False):
        return "admin"

    if hasattr(user, "adminprofile"):
        return "admin"
    if hasattr(user, "manager"):
        return "manager"
    if hasattr(user, "chef"):
        return "chef"
    if hasattr(user, "waiter"):
        return "waiter"
    if hasattr(user, "customer_profile"):
        return "customer"
    return "unknown"


class RegisterCustomerView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    authentication_classes = []

    def perform_create(self, serializer):
        user = serializer.save()
        Customer.objects.create(user=user)


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": get_user_role(user),
            }
        )


class StaffListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        staff = []

        users = User.objects.filter(is_active=True)

        for user in users:
            if hasattr(user, "customer_profile"):
                continue

            role = get_user_role(user)

            if role in ["admin", "manager", "chef", "waiter"]:
                staff.append({
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "role": role,
                })

        return Response(staff)
    

class StaffCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data

        username = data.get("username")
        email = data.get("email")
        password = data.get("password")
        role = data.get("role")

        if not all([username, email, password, role]):
            return Response(
                {"detail": "Missing fields"},
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(username=username).exists():
            return Response(
                {"detail": "Username already exists"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        if role == "chef":
            Chef.objects.create(user=user)
        elif role == "waiter":
            Waiter.objects.create(user=user)
        elif role == "manager":
            Manager.objects.create(user=user)
        elif role == "admin":
            AdminProfile.objects.create(user=user)
        else:
            return Response(
                {"detail": "Invalid role"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"detail": "Staff created successfully"},
            status=status.HTTP_201_CREATED
        )


class StaffUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        role = request.data.get("role")

        if not role:
            return Response(
                {"detail": "Role is required"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        Chef.objects.filter(user=user).delete()
        Waiter.objects.filter(user=user).delete()
        Manager.objects.filter(user=user).delete()
        AdminProfile.objects.filter(user=user).delete()

        if role == "chef":
            Chef.objects.create(user=user)
        elif role == "waiter":
            Waiter.objects.create(user=user)
        elif role == "manager":
            Manager.objects.create(user=user)
        elif role == "admin":
            AdminProfile.objects.create(user=user)
        else:
            return Response(
                {"detail": "Invalid role"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"detail": "Role updated successfully"},
            status=status.HTTP_200_OK
        )
    

class StaffDisableView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"detail": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )

        if user == request.user:
            return Response(
                {"detail": "You cannot disable yourself"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user.is_active = False
        user.save()

        return Response(
            {"detail": "Staff disabled successfully"},
            status=status.HTTP_200_OK
        )