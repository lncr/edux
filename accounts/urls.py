from django.urls import path
from .views import RegisterUserView, user_profile


urlpatterns = [
    path("register/", RegisterUserView.as_view(), name="register"),
    path("user/profile/", user_profile, name="user_profile"),
]
