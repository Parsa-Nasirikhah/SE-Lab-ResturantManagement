from django.db import models
import uuid
from users.models import Customer


class Table(models.Model):
    table_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    number = models.IntegerField()
    capacity = models.IntegerField()

    TABLE_STATUS = [
        ('FREE', 'Free'),
        ('OCCUPIED', 'Occupied'),
        ('RESERVED', 'Reserved'),
    ]
    status = models.CharField(max_length=20, choices=TABLE_STATUS, default='FREE')

    def __str__(self):
        return f"Table {self.number}"


class DiscountCode(models.Model):
    code = models.CharField(max_length=50, unique=True)
    percent_off = models.IntegerField()
    expires_at = models.DateTimeField()
    active = models.BooleanField(default=True)
    used_count = models.IntegerField(default=0)
    max_use = models.IntegerField(default=1)

    def is_valid(self):
        return self.active and self.used_count < self.max_use

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name

class MenuItem(models.Model):
    item_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=150)
    description = models.TextField()
    price = models.DecimalField(max_digits=8, decimal_places=2)
    available = models.BooleanField(default=True)

    def __str__(self):
        return self.name
    
    image = models.ImageField(
        upload_to="menu_items/",
        null=True,
        blank=True
    )

    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        related_name="items"
    )


class InventoryItem(models.Model):
    item = models.OneToOneField(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)


class Order(models.Model):
    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True)
    table = models.ForeignKey(Table, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    estimated_time = models.DateTimeField(null=True, blank=True)

    STATUS = [
        ('PENDING', 'Pending'),
        ('PREPARING', 'Preparing'),
        ('READY', 'Ready'),
        ('SERVED', 'Served'),
        ('CANCELLED', 'Cancelled'),
        ('PAID', 'Paid'),
    ]
    status = models.CharField(max_length=20, choices=STATUS, default='PENDING')
    applied_discount = models.ForeignKey(DiscountCode, null=True, blank=True, on_delete=models.SET_NULL)

    def calculate_total(self):
        return sum(item.line_total() for item in self.items.all())


class OrderItem(models.Model):
    order = models.ForeignKey(Order, related_name="items", on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.PROTECT)
    quantity = models.IntegerField(default=1)
    note = models.TextField(blank=True)

    def line_total(self):
        return self.quantity * self.menu_item.price


class Invoice(models.Model):
    invoice_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    order = models.OneToOneField(Order, on_delete=models.CASCADE)
    customer = models.ForeignKey(Customer, on_delete=models.SET_NULL, null=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20)
    date = models.DateTimeField(auto_now_add=True)


class Payment(models.Model):
    payment_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    invoice = models.OneToOneField(Invoice, on_delete=models.CASCADE)
    status = models.CharField(max_length=20)
    transaction_id = models.CharField(max_length=200, null=True)

