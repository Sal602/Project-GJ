from django.db import models
from django.conf import settings
from django.utils import timezone
from datetime import timedelta


class Challenge(models.Model):
    STATUS_PENDING = 'pending'
    STATUS_ACTIVE = 'active'
    STATUS_COMPLETED = 'completed'
    STATUS_DECLINED = 'declined'

    STATUS_CHOICES = [
        (STATUS_PENDING, 'Pending'),
        (STATUS_ACTIVE, 'Active'),
        (STATUS_COMPLETED, 'Completed'),
        (STATUS_DECLINED, 'Declined'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)

    # Log when challenge was created and last updated
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Start date will be set when the opponent accepts the challenge
    start_date = models.DateTimeField(null=True, blank=True)
    # End date defaults to 7 days after start_date when accepted
    end_date = models.DateTimeField(null=True, blank=True)

    challenger = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='challenges_made',
        on_delete=models.CASCADE,
    )
    opponent = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name='challenges_received',
        on_delete=models.CASCADE,
    )

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default=STATUS_PENDING)

    def __str__(self):
        return f"{self.title} ({self.status})"

    def accept(self, accept_time=None, duration_days=7):
        """Mark challenge as accepted/active and set start/end dates.

        Call this when the opponent accepts the challenge. By default the
        start_date is set to now and the end_date to `start_date + 7 days`.
        """
        if self.status != self.STATUS_PENDING:
            return
        now = accept_time or timezone.now()
        self.start_date = now
        self.end_date = now + timedelta(days=duration_days)
        self.status = self.STATUS_ACTIVE
        self.save()

    def finalize(self):
        """Mark the challenge completed. Winner calculation is done elsewhere."""
        self.status = self.STATUS_COMPLETED
        self.save()

    def compute_progress(self):
        """Aggregate completed study_session total_time for challenger and opponent.

        Returns a dict with keys:
          - challenger_total (timedelta or None)
          - opponent_total (timedelta or None)
          - challenger_seconds (int)
          - opponent_seconds (int)
        """
        # Local import to avoid circular imports at module load time
        from django.db.models import Sum
        from study_session.models import study_session as StudySession

        base_qs = StudySession.objects.filter(challenge=self, end_time__isnull=False, total_time__isnull=False)
        if self.start_date:
            base_qs = base_qs.filter(start_time__gte=self.start_date)
        if self.end_date:
            base_qs = base_qs.filter(end_time__lte=self.end_date)

        from django.db.models import Max

        chal_agg = base_qs.filter(user=self.challenger).aggregate(total=Sum('total_time'), last_end=Max('end_time'))
        opp_agg = base_qs.filter(user=self.opponent).aggregate(total=Sum('total_time'), last_end=Max('end_time'))

        chal_total = chal_agg.get('total')
        opp_total = opp_agg.get('total')
        chal_last = chal_agg.get('last_end')
        opp_last = opp_agg.get('last_end')

        def td_seconds(td):
            return int(td.total_seconds()) if td else 0

        return {
            'challenger_total': chal_total,
            'opponent_total': opp_total,
            'challenger_seconds': td_seconds(chal_total),
            'opponent_seconds': td_seconds(opp_total),
            'challenger_minutes': td_seconds(chal_total) // 60,
            'opponent_minutes': td_seconds(opp_total) // 60,
            'challenger_last_end': chal_last,
            'opponent_last_end': opp_last,
        }