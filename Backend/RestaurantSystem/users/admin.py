from django.contrib import admin
from .models import User, Customer, Waiter, Chef, Manager, AdminProfile, Editor

admin.site.register(User)
admin.site.register(Customer)
admin.site.register(Waiter)
admin.site.register(Chef)
admin.site.register(Manager)
admin.site.register(AdminProfile)
admin.site.register(Editor)
