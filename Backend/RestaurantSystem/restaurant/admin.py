from django.contrib import admin
from .models import Table, DiscountCode, MenuItem, InventoryItem, Order, OrderItem, Invoice, Payment, Category

admin.site.register(Table)
admin.site.register(DiscountCode)
admin.site.register(MenuItem)
admin.site.register(InventoryItem)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Invoice)
admin.site.register(Payment)
admin.site.register(Category)
