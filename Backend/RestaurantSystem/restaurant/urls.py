from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    TableViewSet,
    MenuItemViewSet,
    InventoryItemViewSet,
    OrderViewSet,
    OrderItemViewSet,
    InvoiceViewSet,
    PaymentViewSet,
    OrderDetailView,
    CategoryViewSet
)

router = DefaultRouter()
router.register(r"tables", TableViewSet, basename="tables")
router.register(r"menu-items", MenuItemViewSet, basename="menu-items")
router.register(r"inventory", InventoryItemViewSet, basename="inventory")
router.register(r"orders", OrderViewSet, basename="orders")
router.register(r"order-items", OrderItemViewSet, basename="order-items")
router.register(r"invoices", InvoiceViewSet, basename="invoices")
router.register(r"payments", PaymentViewSet, basename="payments")
router.register("categories", CategoryViewSet)
router.register("menu-items", MenuItemViewSet)


# router.register(r"dashboard", DashboardViewSet, basename="dashboard")



urlpatterns = [
    path("", include(router.urls)),
    path("orders/<uuid:order_id>/", OrderDetailView.as_view()),

]
