from django.contrib import admin
from .models import University, Faculty, Division, Gallery


class FacultyInline(admin.TabularInline):
    model = Faculty
    extra = 1  # how many empty rows to show


class DivisionInline(admin.TabularInline):
    model = Division
    extra = 1


class GalleryInline(admin.TabularInline):
    model = Gallery
    extra = 1


@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ("name", "location", "established", "students", "ranking")
    search_fields = ("name", "location")
    list_filter = ("location", "ranking")
    inlines = [FacultyInline, DivisionInline, GalleryInline]


@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ("name", "university")
    search_fields = ("name",)
    list_filter = ("university",)


@admin.register(Division)
class DivisionAdmin(admin.ModelAdmin):
    list_display = ("name", "university")
    search_fields = ("name",)
    list_filter = ("university",)


@admin.register(Gallery)
class GalleryAdmin(admin.ModelAdmin):
    list_display = ("university", "image")
    list_filter = ("university",)
