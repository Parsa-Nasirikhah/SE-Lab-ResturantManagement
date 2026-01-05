from rest_framework import serializers
from .models import (
    Table,
    MenuItem,
    InventoryItem,
    Order,
    OrderItem,
    Invoice,
    Payment,
    Category
)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ["id", "name"]

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = "__all__"


class MenuItemSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)


    class Meta:
        model = MenuItem
        fields = "__all__"

    def get_image(self, obj):
        request = self.context.get("request")
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        if obj.image:
            return obj.image.url
        return None



class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = "__all__"


class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_detail = MenuItemSerializer(source="menu_item", read_only=True)

    class Meta:
        model = OrderItem
        fields = [
            "id",
            "menu_item",
            "menu_item_detail",
            "quantity",
            "note",
        ]

class OrderDetailItemSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="menu_item.name")
    price = serializers.DecimalField(
        source="menu_item.price",
        max_digits=10,
        decimal_places=2
    )

    class Meta:
        model = OrderItem
        fields = ["name", "quantity", "price"]

class OrderDetailSerializer(serializers.ModelSerializer):
    items = OrderDetailItemSerializer(many=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "order_id",
            "status",
            "created_at",
            "estimated_time",
            "items",
            "total_price",
        ]

    def get_total_price(self, obj):
        return obj.calculate_total()



class OrderItemCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["menu_item", "quantity", "note"]


class OrderCreateSerializer(serializers.ModelSerializer):
    items = OrderItemCreateSerializer(many=True, write_only=True)
    total_price = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Order
        fields = [
            "order_id",
            "table",
            "applied_discount",
            "created_at",
            "estimated_time",
            "status",
            "items",
            "total_price",
        ]
        read_only_fields = ["order_id", "created_at", "estimated_time", "status"]

    def get_total_price(self, obj):
        return obj.calculate_total()

    def create(self, validated_data):
        items_data = validated_data.pop("items", [])
        order = Order.objects.create(**validated_data)
        for item in items_data:
            OrderItem.objects.create(order=order, **item)
        return order


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            "order_id",
            "customer",
            "table",
            "status",
            "created_at",
            "estimated_time",
            "applied_discount",
            "items",
            "total_price",
        ]
        read_only_fields = ["order_id", "created_at"]

    def get_total_price(self, obj):
        return obj.calculate_total()

class InvoiceSerializer(serializers.ModelSerializer):
    order_detail = OrderSerializer(source="order", read_only=True)

    class Meta:
        model = Invoice
        fields = [
            "invoice_id",
            "order",
            "order_detail",
            "customer",
            "amount",
            "status",
            "date",
        ]
        read_only_fields = ["invoice_id", "date", "amount"]


class PaymentSerializer(serializers.ModelSerializer):
    invoice_detail = InvoiceSerializer(source="invoice", read_only=True)

    class Meta:
        model = Payment
        fields = [
            "payment_id",
            "invoice",
            "invoice_detail",
            "status",
            "transaction_id",
        ]
        read_only_fields = ["payment_id"]

