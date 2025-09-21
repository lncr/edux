from rest_framework import generics, permissions
from rest_framework.response import Response
from .models import University
from .serializers import UniversitySerializer


class UniversityListCreateView(generics.ListCreateAPIView):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer

    def get_permissions(self):
        if self.request.method == "POST":
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]


class UniversityDetailView(generics.RetrieveUpdateAPIView):
    queryset = University.objects.all()
    serializer_class = UniversitySerializer

    def get_permissions(self):
        if self.request.method in ["PUT", "PATCH"]:
            return [permissions.IsAdminUser()]
        return [permissions.AllowAny()]
