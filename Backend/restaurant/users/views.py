from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from .models import User, Customer
from .serializers import RegisterSerializer


class RegisterCustomerView(generics.CreateAPIView):
    serializer_class = RegisterSerializer

    def perform_create(self, serializer):
        user = serializer.save()
        Customer.objects.create(user=user)
