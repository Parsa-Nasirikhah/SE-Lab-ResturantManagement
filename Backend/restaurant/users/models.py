from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager
import uuid

# --- UserManager ---
class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, role='customer'):
        if not email:
            raise ValueError("User must have an email")
        user = self.model(
            email=self.normalize_email(email),
            username=username,
            role=role
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password):
        user = self.create_user(email, username, password, role='admin')
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

# --- مدل اصلی User ---
class User(AbstractBaseUser, PermissionsMixin):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('manager', 'Manager'),
        ('chef', 'Chef'),
        ('waiter', 'Waiter'),
        ('editor', 'Editor'),
        ('customer', 'Customer'),
    )
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='customer')
    
    # فیلدهای پروفایل (Profile use cases)
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    class Meta:
        verbose_name = 'User'
        verbose_name_plural = 'Users'
        ordering = ['-date_joined']
    

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"

# --- مدل‌های اختصاصی هر نقش ---

class Admin(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='admin_profile')
    admin_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)

    class Meta:
        verbose_name = 'Admin'
        verbose_name_plural = 'Admins'
    
    def __str__(self):
        return f"Admin: {self.user.username}"

class Manager(models.Model):
    class Manager(models.Model):
        user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='manager_profile')
        manager_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
        department = models.CharField(max_length=100, blank=True)
    
    class Meta:
        verbose_name = 'Manager'
        verbose_name_plural = 'Managers'
    
    def __str__(self):
        return f"Manager: {self.user.username}"

class Chef(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='chef_profile')
    chef_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    
    def __str__(self):
        return f"Chef: {self.user.username}"

class Waiter(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='waiter_profile')
    waiter_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)    
    
    class Meta:
        verbose_name = 'Waiter'
        verbose_name_plural = 'Waiters'


    def __str__(self):
        return f"Waiter: {self.user.username}"
    
    

class Editor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='editor_profile')
    editor_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
   
    class Meta:
        verbose_name = 'Editor'
        verbose_name_plural = 'Editors'
   
    def __str__(self):
        return f"Editor: {self.user.username}"




class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='customer_profile')
    customer_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    
    current_table = models.ForeignKey(
        'Table',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='current_customers',
        help_text='میزی که مشتری در حال حاضر نشسته'
    )
    
    total_orders = models.IntegerField(default=0)
    total_spent = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    class Meta:
        verbose_name = 'Customer'
        verbose_name_plural = 'Customers'
    
    def __str__(self):
        return f"Customer: {self.user.username}"
    





