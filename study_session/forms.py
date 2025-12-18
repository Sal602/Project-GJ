from django import forms
from .models import study_session
from datetime import timedelta

class StudySessionForm(forms.ModelForm):
    hours = forms.IntegerField(min_value=0, required=True, label="Goal Hours")
    minutes = forms.IntegerField(min_value=0, max_value=59, required=True, label="Goal Minutes")

    class Meta:
        model = study_session
        fields = ['study_subject']

    def save(self, commit=True):
        instance = super().save(commit=False)
        
        h = self.cleaned_data['hours']
        m = self.cleaned_data['minutes']

        instance.goal_time = timedelta(hours=h, minutes=m)

        if commit:
            instance.save()

        return instance