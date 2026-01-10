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