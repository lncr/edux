from rest_framework import generics
from .models import CustomUser
from .serializers import UserSerializer


class RegisterUserView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer
