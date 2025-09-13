from django.db import models


class University(models.Model):
    name = models.CharField(max_length=255)
    thumbnail = models.ImageField(upload_to='unversities/')
