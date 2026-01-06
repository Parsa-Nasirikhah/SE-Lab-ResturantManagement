from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class User(AbstractUser):
    user_id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    history = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.username

class Customer(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="customer_profile")
    table_number = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Customer {self.user.username}"


class Waiter(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Waiter {self.user.username}"


class Chef(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Chef {self.user.username}"


class Manager(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Manager {self.user.username}"


class AdminProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Admin {self.user.username}"


class Editor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)

    def __str__(self):
        return f"Editor {self.user.username}"
