from __future__ import annotations

from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework import generics
from rest_framework.decorators import action




from users.models import Customer

from .models import InventoryItem, Invoice, MenuItem, Order, OrderItem, Payment, Table, Category
from .serializers import (
    InventoryItemSerializer,
    InvoiceSerializer,
    MenuItemSerializer,
    OrderItemSerializer,
    OrderCreateSerializer,
    OrderSerializer,
    PaymentSerializer,
    TableSerializer,
    OrderDetailSerializer,
    CategorySerializer
)
from .permissions import (
    IsOwnerCustomerOrStaff,
    ReadOnlyOrRoles,
    get_user_role,
)


STAFF_ROLES = {"admin", "manager", "chef", "waiter"}


class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

    permission_classes = [IsAuthenticated, ReadOnlyOrRoles]
    allowed_roles = ["waiter", "manager", "admin"]




class MenuItemViewSet(viewsets.ModelViewSet):
    queryset = MenuItem.objects.all()
    serializer_class = MenuItemSerializer

    permission_classes = [IsAuthenticated, ReadOnlyOrRoles]
    allowed_roles = ["chef", "manager", "admin"]



class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer
    permission_classes = [IsAuthenticated, ReadOnlyOrRoles]
    allowed_roles = ["chef", "manager", "admin"]

class OrderViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated, IsOwnerCustomerOrStaff]

    def get_serializer_class(self):
        if self.action == "create":
            return OrderCreateSerializer
        return OrderSerializer

    def get_queryset(self):
        role = get_user_role(self.request.user)
        if role in STAFF_ROLES:
            return Order.objects.all().order_by("-created_at")

        try:
            customer: Customer = self.request.user.customer_profile
        except Exception:
            return Order.objects.none()

        return Order.objects.filter(customer=customer).order_by("-created_at")

    def create(self, request, *args, **kwargs):
        role = get_user_role(request.user)
        if role != "customer":
            raise PermissionDenied("Only customers can create orders")

        customer = request.user.customer_profile

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save(customer=customer)

        out = OrderSerializer(order, context=self.get_serializer_context())
        headers = self.get_success_headers(out.data)
        return Response(out.data, status=status.HTTP_201_CREATED, headers=headers)
    
    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):
        order = self.get_object()
        new_status = request.data.get("status")

        allowed = ["PREPARING", "READY", "SERVED", "PAID"]
        if new_status not in allowed:
            return Response(
                {"detail": "Invalid status"},
                status=drf_status.HTTP_400_BAD_REQUEST
            )

        order.status = new_status
        order.save()

        return Response(
            {"status": order.status},
            status=drf_status.HTTP_200_OK
        )



class OrderItemViewSet(viewsets.ModelViewSet):
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated, IsOwnerCustomerOrStaff]

    def get_queryset(self):
        role = get_user_role(self.request.user)
        if role in STAFF_ROLES:
            return OrderItem.objects.select_related("order", "menu_item").all()

        try:
            customer: Customer = self.request.user.customer_profile
        except Exception:
            return OrderItem.objects.none()

        return OrderItem.objects.select_related("order", "menu_item").filter(order__customer=customer)


class InvoiceViewSet(viewsets.ModelViewSet):
    serializer_class = InvoiceSerializer
    permission_classes = [IsAuthenticated, IsOwnerCustomerOrStaff]

    def get_queryset(self):
        role = get_user_role(self.request.user)
        if role in {"admin", "manager"}:
            return Invoice.objects.select_related("order").all()

        try:
            customer: Customer = self.request.user.customer_profile
        except Exception:
            return Invoice.objects.none()

        return Invoice.objects.select_related("order").filter(order__customer=customer)


class PaymentViewSet(viewsets.ModelViewSet):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated, IsOwnerCustomerOrStaff]

    def get_queryset(self):
        role = get_user_role(self.request.user)
        if role in {"admin", "manager"}:
            return Payment.objects.select_related("invoice", "invoice__order").all()

        try:
            customer: Customer = self.request.user.customer_profile
        except Exception:
            return Payment.objects.none()

        return Payment.objects.select_related("invoice", "invoice__order").filter(
            invoice__order__customer=customer
        )


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderDetailSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "order_id"

    def get_queryset(self):
        return Order.objects.filter(
            customer=self.request.user.customer
        )
    
class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
