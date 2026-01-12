from rest_framework import serializers
from .models import Challenge

class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at', 'challenger', 'opponent')