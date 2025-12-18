from django.shortcuts import render, redirect, get_object_or_404
from .forms import StudySessionForm
from .models import study_session
from django.utils import timezone
from django.views.decorators.http import require_POST

# Create your views here.

def start_session(request):
    if request.method == 'POST':
        form = StudySessionForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('session_list')
    else:
        form = StudySessionForm()

    return render(request, 'study_session/start_session.html', {'form': form})


def session_list(request):
    sessions = study_session.objects.order_by('-start_time')
    return render(request, 'study_session/session_list.html', {'sessions': sessions})

@require_POST
def end_session(request, session_id):
    session = get_object_or_404(study_session, id=session_id, end_time=None)
    session.end_time = timezone.now()
    session.save()
    return redirect('session_list')

def session_detail(request, session_id):
    session = get_object_or_404(study_session, id=session_id)
    return render(request, 'study_session/session_detail.html', {'session': session})