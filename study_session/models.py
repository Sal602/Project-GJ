from django.db import models

# This is going to represent the info on a study session

class study_session(models.Model):
    # We should think about data we want to store for a study session
    # ie. Start time, End time, total time, date 
    # Possible: Study Subject, Goal study time etc
    date = models.DateField(auto_now_add=True)
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(null=True, blank=True) 
    
    study_subject = models.CharField(max_length=20)

    total_time = models.DurationField(null=True, blank=True)
    goal_time = models.DurationField()

    goal_passed = models.BooleanField(default=False)

    def study_duration_minutes(self):
        """Return the total study duration in whole minutes, or None."""
        if self.total_time:
            return int(self.total_time.total_seconds() / 60)
        return None
    
    def save(self, *args, **kwargs):
        # Ensure total_time is computed from start/end before evaluating goal
        self.get_total_time()

        # Only compare when total_time is available
        if self.total_time is not None and self.goal_time is not None:
            self.goal_passed = self.total_time >= self.goal_time
        else:
            self.goal_passed = False

        super().save(*args, **kwargs)
    
    def get_total_time(self):
        if self.end_time:
            self.total_time = self.end_time - self.start_time
            return self.total_time
        # If there's no end_time yet, clear total_time to avoid stale values
        self.total_time = None
        return None
            
        



