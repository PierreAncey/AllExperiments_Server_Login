from rest_framework import serializers
from .models import UnityData

class UnityDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = UnityData
        fields = '__all__'

    