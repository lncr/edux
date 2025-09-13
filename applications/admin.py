from django.contrib import admin

from .models import Application


@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "university",
        "prior_highest_education",
        "cover_letter",
    )
    search_fields = ("user__email", "university__name")
    list_filter = ("prior_highest_education",)
