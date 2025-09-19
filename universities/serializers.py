from rest_framework import serializers
from .models import University, Faculty, Division, Gallery


class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ["id", "name"]


class DivisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Division
        fields = ["id", "name"]


class GallerySerializer(serializers.ModelSerializer):
    image = serializers.ImageField(use_url=True)  # ensures URL is returned

    class Meta:
        model = Gallery
        fields = ["id", "image"]


class UniversitySerializer(serializers.ModelSerializer):
    faculties = FacultySerializer(many=True, read_only=True, source="faculty_set")
    divisions = DivisionSerializer(many=True, read_only=True, source="division_set")
    gallery = GallerySerializer(many=True, read_only=True, source="gallery_set")

    class Meta:
        model = University
        fields = [
            "id",
            "name",
            "thumbnail",
            "location",
            "established",
            "students",
            "ranking",
            "faculties",
            "divisions",
            "gallery",
        ]
