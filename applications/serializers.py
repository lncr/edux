from rest_framework import serializers
from .models import Application
from universities.models import University


class ApplicationSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source='university__name')
    class Meta:
        model = Application
        fields = [
            "id",
            "user",
            "university",
            "university_name",
            "recommendation_letter",
            "prior_highest_education",
            "education_document",
            "status",
            "created_at",
            "target_program",
        ]
        read_only_fields = ["user", "status", "university_name"]  # user set automatically

    def create(self, validated_data):
        validated_data["user"] = self.context["request"].user
        validated_data['university_id'] = validated_data.pop('university')
        validated_data.pop('university_name')
        super().create(validated_data=validated_data)
