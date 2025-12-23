from rest_framework import serializers
from .models import study_session


class StudySessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = study_session
        fields = '__all__'
        read_only_fields = ('id', 'date', 'start_time', 'total_time', 'goal_passed')
