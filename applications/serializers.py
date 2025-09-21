from rest_framework import serializers
from .models import Application
from universities.models import University


class ApplicationSerializer(serializers.ModelSerializer):
    university_name = serializers.CharField(source='university__name', read_only=True)
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
        validated_data.pop('university_name', None)
        return super().create(validated_data=validated_data)

    def to_internal_value(self, data):
        print(data)
        data['university_name'] = 'qwe'
        prior_highest_education_list = [x.value for x in Application.PriorEducation]
        for pr in prior_highest_education_list:
            if pr.lower() in data['prior_highest_education'].lower():
                data['prior_highest_education'] = pr
        target_program_list = [x.value for x in Application.TargetProgram]
        for tp in target_program_list:
            if tp.lower() in data['target_program'].lower():
                data['target_program'] = tp
        return super().to_internal_value(data)


class RecommendSerializer(serializers.Serializer):
    interested_in = serializers.CharField(allow_blank=True)
    good_at = serializers.CharField(allow_blank=True)
