# Create your models here.
from django.db import models
import pytz
from datetime import datetime
from django.contrib.auth.models import User
import uuid

# This model is used to store the experiments

class Experiment(models.Model):
    name = models.CharField(max_length=200)
    researchers = models.ManyToManyField(User)
    token = models.UUIDField(default=uuid.uuid4, editable=False)

    def __str__(self):
        return self.name

# This model is used to store the csv data from the Unity Project
class UnityData(models.Model):
    # Associated fields
    timestamp = models.DateTimeField(default=datetime.now(pytz.timezone('Europe/Brussels')), help_text="Timestamp of when the data was recorded")
    csvData = models.TextField(default="", help_text="CSV data from the Unity Project")

    # Associated experiment
    experiment = models.ForeignKey(Experiment, on_delete=models.CASCADE, related_name='unity_data', default=None)

    def __str__(self):
        return f"Experiment Name: {self.experiment.name}, Timestamp: {self.timestamp}"

