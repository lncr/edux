from rest_framework import serializers
from .models import CustomUser, Profile


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ["bio", "avatar"]


class UserSerializer(serializers.ModelSerializer):
    profile = ProfileSerializer()
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["id", "email", "first_name", "last_name", "password", "profile"]

    def create(self, validated_data):
        profile_data = validated_data.pop("profile")
        password = validated_data.pop("password")
        user = CustomUser.objects.create(**validated_data)
        user.set_password(password)
        user.save()

        Profile.objects.create(user=user, **profile_data)
        return user
