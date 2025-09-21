from django.db import models


class University(models.Model):
    name = models.CharField(max_length=255)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, default='')
    established = models.IntegerField(default=1625)
    students = models.IntegerField(default=4892)
    ranking = models.IntegerField(default=3)


class Faculty(models.Model):
    name = models.CharField(max_length=255)
    university = models.ForeignKey(University, on_delete=models.CASCADE)


class Division(models.Model):
    name = models.CharField(max_length=255)
    university = models.ForeignKey(University, on_delete=models.CASCADE)


class Gallery(models.Model):
    image = models.ImageField(upload_to='images/', blank=True, null=True)
    university = models.ForeignKey(University, on_delete=models.CASCADE)
