from django.conf import settings
from django.db import models


class Application(models.Model):

    class PriorEducation(models.TextChoices):
        NO_EDUCATION = 'NO EDUCATION', 'No Education'
        HIGH_SCHOOL = 'HIGH SCHOOL', 'High School'
        BACHELORS = 'BACHELORS', 'Bachelors'
        MASTERS = 'MASTERS', 'Masters'
        PHD = 'PHD', 'PhD'

    user = models.ForeignKey(settings.AUTH_USER_MODEL,
                             on_delete=models.CASCADE,
                             related_name='applications')
    university = models.ForeignKey('universities.University',
                                   on_delete=models.CASCADE,
                                   related_name='applications')
    cover_letter = models.TextField(blank=True, default='')
    prior_highest_education = models.CharField(max_length=32,
                                               choices=PriorEducation.choices,
                                               default=PriorEducation.NO_EDUCATION)
    certificate = models.ImageField(upload_to="certifcates/", blank=True, null=True)
