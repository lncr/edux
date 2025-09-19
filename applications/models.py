from django.conf import settings
from django.db import models


class Application(models.Model):
    class PriorEducation(models.TextChoices):
        NO_EDUCATION = 'NO EDUCATION', 'No Education'
        HIGH_SCHOOL = 'HIGH SCHOOL', 'High School'
        BACHELORS = 'BACHELORS', 'Bachelors'
        MASTERS = 'MASTERS', 'Masters'
        PHD = 'PHD', 'PhD'
    prior_highest_education = models.CharField(max_length=32,
                                               choices=PriorEducation.choices,
                                               default=PriorEducation.NO_EDUCATION)
    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE,
                             related_name='applications')
    university = models.ForeignKey('universities.University',
                                   on_delete=models.CASCADE,
                                   related_name='applications')
    essay = models.TextField(blank=True, default='')
    education_document = models.ImageField(upload_to="education_document/", blank=True, null=True)
    recommendation_letter = models.FileField(upload_to="recommendation_letter/", blank=True, null=True)
