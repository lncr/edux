from django.conf import settings
from django.db import models
from datetime import datetime


class Application(models.Model):
    class PriorEducation(models.TextChoices):
        NO_EDUCATION = 'NO EDUCATION', 'No Education'
        MIDDLE_SCHOOL = 'MIDDLE SCHOOL', 'Middle School'
        HIGH_SCHOOL = 'HIGH SCHOOL', 'High School'
        BACHELOR = 'BACHELOR', 'Bachelor'
        MASTER = 'MASTER', 'Master'
        PHD = 'PHD', 'PhD'

    class ApplicationStatus(models.TextChoices):
        SUBMITTED = 'SUBMITTED', 'Submitted'
        ACCEPTED = 'ACCEPTED', 'Accepted'
        WHITE_LISTED = 'WHITE LISTED', 'Waitlisted'
        UNDER_REVIEW = 'UNDER REVIEW', 'Under Review'
        REJECTED = 'REJECTED', 'Rejected'

    class TargetProgram(models.TextChoices):
        BACHELOR = 'BACHELOR', 'Bachelor'
        MASTER = 'MASTER', 'Master'
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
    education_document = models.FileField(upload_to='education_docs/', blank=True, null=True)
    recommendation_letter = models.FileField(upload_to="recommendation_letter/", blank=True, null=True)
    status = models.CharField(max_length=32,
                               choices=ApplicationStatus.choices,
                               default=ApplicationStatus.SUBMITTED)
    created_at = models.DateTimeField(auto_now=True)
    target_program = models.CharField(max_length=32,
                               choices=TargetProgram.choices,
                               default=TargetProgram.BACHELOR)
