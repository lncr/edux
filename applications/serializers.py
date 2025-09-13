from rest_framework import serializers
from .models import Application


class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = [
            "id",
            "user",
            "university",
            "cover_letter",
            "prior_highest_education",
            "certificate",
        ]
        read_only_fields = ["user"]  # user set automatically

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        return super().create(validated_data)
