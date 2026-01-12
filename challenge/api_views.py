from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import Challenge
from .serializers import ChallengeSerializer
from django.db.models import Sum, Max
from study_session.models import study_session as StudySession

class ChallengeViewSet(viewsets.ModelViewSet):
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(challenger=self.request.user)

    # update challenger and opponent progress after study session completion
    @action(detail=True, methods=['post'])
    def update_progress(self, request, pk=None):
        """Recompute and return current totals for challenger and opponent.

        This aggregates `study_session.total_time` for sessions linked to this
        challenge and that have a non-null `end_time` (completed sessions).
        Returns totals in seconds and minutes.
        """
        challenge = self.get_object()

        # Only participants (or staff) may request progress
        user = request.user
        if not (user == challenge.challenger or user == challenge.opponent or user.is_staff):
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        progress = challenge.compute_progress()
        # drop the raw timedelta fields when returning JSON
        payload = {
            'challenger_seconds': progress['challenger_seconds'],
            'opponent_seconds': progress['opponent_seconds'],
            'challenger_minutes': progress['challenger_minutes'],
            'opponent_minutes': progress['opponent_minutes'],
        }

        return Response({"detail": "Progress computed", "progress": payload}, status=status.HTTP_200_OK)

    # Determine the winner of the challenge
    @action(detail=True, methods=['post'])
    def determine_winner(self, request, pk=None):
        """Calculate winner based on aggregated study time for the challenge window.

        Tie-breaker: if totals equal, the participant who reached the total earlier
        (i.e., has an earlier latest `end_time`) wins. If still tied, returns tie.
        This action finalizes the challenge (marks completed) after determining winner.
        """
        challenge = self.get_object()

        user = request.user
        if not (user == challenge.challenger or user == challenge.opponent or user.is_staff):
            return Response({"detail": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        progress = challenge.compute_progress()

        chal_seconds = progress['challenger_seconds']
        opp_seconds = progress['opponent_seconds']

        winner = None
        if chal_seconds > opp_seconds:
            winner = challenge.challenger.username
        elif opp_seconds > chal_seconds:
            winner = challenge.opponent.username
        else:
            # Tie-breaker: compare last_end times returned by compute_progress
            chal_last = progress.get('challenger_last_end')
            opp_last = progress.get('opponent_last_end')
            if chal_last and opp_last:
                if chal_last < opp_last:
                    winner = challenge.challenger.username
                elif opp_last < chal_last:
                    winner = challenge.opponent.username
                else:
                    winner = None
            else:
                winner = None

        # Finalize challenge status
        challenge.finalize()

        return Response({
            "detail": "Winner determined",
            "winner": winner,
            "challenger_seconds": int(chal_seconds),
            "opponent_seconds": int(opp_seconds),
        }, status=status.HTTP_200_OK)