from django.db import models
import uuid
from users.models import Waiter,User,Chef,Customer

class Table(models.Model):
    STATUS_CHOICES = (
        ('available', 'Available'),
        ('occupied', 'Occupied'),
        ('reserved', 'Reserved'),
    )
    
    table_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    number = models.IntegerField(unique=True)
    capacity = models.IntegerField(default=4)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    
    # ✅ اصلاح: اضافه کردن رابطه به Waiter
    assigned_waiter = models.ForeignKey(
        Waiter,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_tables',
        help_text='پیشخدمتی که این میز رو مدیریت می‌کنه'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Table'
        verbose_name_plural = 'Tables'
        ordering = ['number']

    def __str__(self):
        return f"Table {self.number} ({self.get_status_display()})"




class InventoryItem(models.Model):
    item_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    quantity = models.IntegerField(default=0)
    unit = models.CharField(max_length=20, default='kg')
    min_quantity = models.IntegerField(default=10)
    
    # ✅ اصلاح: اضافه کردن مدیر موجودی
    managed_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role__in': ['chef', 'manager']},
        related_name='managed_inventory',
        help_text='Chef یا Manager که موجودی رو مدیریت می‌کنه'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Inventory Item'
        verbose_name_plural = 'Inventory Items'
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.quantity} {self.unit})"



class MenuItem(models.Model):
    item_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    available = models.BooleanField(default=True)
    category = models.CharField(max_length=50)
    image_url = models.URLField(null=True, blank=True)
    
    # ✅ اصلاح: اضافه کردن ردیابی Editor
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'editor'},
        related_name='created_menu_items',
        help_text='Editor که این منو رو ایجاد کرده'
    )
    updated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'editor'},
        related_name='updated_menu_items',
        help_text='Editor که آخرین بار این منو رو ویرایش کرده'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Menu Item'
        verbose_name_plural = 'Menu Items'
        ordering = ['category', 'name']

    def __str__(self):
        return f"{self.name} - {self.price}$"
    


class DiscountCode(models.Model):
    code = models.CharField(max_length=20, unique=True)
    percent_off = models.IntegerField()
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    usage_limit = models.IntegerField()
    times_used = models.IntegerField(default=0)
    
    # ✅ ردیابی ایجاد کننده
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role__in': ['admin', 'manager']},
        related_name='created_discount_codes'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Discount Code'
        verbose_name_plural = 'Discount Codes'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.code} ({self.percent_off}% off)"




class Order(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('delivered', 'Delivered'),
        ('cancelled', 'Cancelled'),
    )
    
    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    applied_discount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # روابط
    table = models.ForeignKey(Table, on_delete=models.SET_NULL, null=True, related_name='orders')
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    discount_code = models.ForeignKey(DiscountCode, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    
    # ✅ اصلاح: اضافه کردن روابط با Waiter و Chef
    created_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'waiter'},
        related_name='created_orders',
        help_text='Waiter که سفارش رو ثبت کرده'
    )
    assigned_chef = models.ForeignKey(
        Chef,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='assigned_orders',
        help_text='Chef که سفارش رو آماده می‌کنه'
    )
    
    class Meta:
        verbose_name = 'Order'
        verbose_name_plural = 'Orders'
        ordering = ['-created_at']

    def __str__(self):
        return f"Order {self.order_id} - {self.get_status_display()}"




class OrderItem(models.Model):
    order_item_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='order_items')
    quantity = models.IntegerField(default=1)
    note = models.CharField(max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Order Item'
        verbose_name_plural = 'Order Items'

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name}"




class Invoice(models.Model):
    STATUS_CHOICES = (
        ('paid', 'Paid'),
        ('unpaid', 'Unpaid'),
        ('cancelled', 'Cancelled'),
    )
    
    invoice_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    issued_at = models.DateTimeField(auto_now_add=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='unpaid')
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='invoice')
    
    # ✅ ردیابی صادر کننده
    issued_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role__in': ['waiter', 'admin']},
        related_name='issued_invoices'
    )
    
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Invoice'
        verbose_name_plural = 'Invoices'
        ordering = ['-issued_at']

    def __str__(self):
        return f"Invoice {self.invoice_id} - {self.get_status_display()}"
    
    def generate_bill(self):
        """تولید فاکتور"""
        self.amount = self.order.total_amount
        self.save()



class Payment(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    )
    
    payment_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    transaction_id = models.CharField(max_length=100)
    invoice = models.ForeignKey(Invoice, on_delete=models.CASCADE, related_name='payments')
    
    # ✅ اصلاح: اضافه کردن تایید کننده
    approved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        limit_choices_to={'role': 'admin'},
        related_name='approved_payments',
        help_text='Admin که پرداخت رو تایید کرده'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
        ordering = ['-created_at']

    def __str__(self):
        return f"Payment {self.payment_id} - {self.get_status_display()}"


class Feedback(models.Model):
    RATING_CHOICES = [(i, str(i)) for i in range(1, 6)]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    rating = models.IntegerField(choices=RATING_CHOICES)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    is_reviewed = models.BooleanField(default=False)
    admin_response = models.TextField(blank=True)
    
    # روابط
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='feedbacks')
    
    # ✅ اصلاح: تغییر به OneToOne 
