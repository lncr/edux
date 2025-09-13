from django.urls import path
from .views import ApplicationListCreateView, ApplicationDetailView

urlpatterns = [
    path("applications/", ApplicationListCreateView.as_view(), name="application-list"),
    path("applications/<int:pk>/", ApplicationDetailView.as_view(), name="application-detail"),
]
