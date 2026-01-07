from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone

from .models import study_session
from .serializers import StudySessionSerializer


class StudySessionViewSet(viewsets.ModelViewSet):
    queryset = study_session.objects.all().order_by('-start_time')
    serializer_class = StudySessionSerializer

    def perform_create(self, serializer):
        # assign the creating user server-side to avoid trusting client data
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'])
    def end(self, request, pk=None):
        session = self.get_object()
        if session.end_time is not None:
            return Response({'detail': 'Session already ended.'}, status=status.HTTP_400_BAD_REQUEST)
        session.end_time = timezone.now()
        session.save()
        return Response(self.get_serializer(session).data)
