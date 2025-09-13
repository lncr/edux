from django.urls import path
from .views import UniversityListCreateView, UniversityDetailView

urlpatterns = [
    path("universities/", UniversityListCreateView.as_view(), name="university-list"),
    path("universities/<int:pk>/", UniversityDetailView.as_view(), name="university-detail"),
]
