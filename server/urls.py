"""
API ROUTES for React Frontend

These routes expose JSON endpoints for authentication and
future app features

Django is purely the backend API now
"""
from django.contrib import admin
from django.urls import include, path
from django.views.generic import RedirectView
from . import views

urlpatterns = [
    path("api/signup/", views.api_signup, name="api_signup"),
    path("api/login/", views.api_login, name="api_login"),
    path('test_token/', views.test_token),
    path("api/ping/", views.ping, name="ping"),
    path("study_session/", include("study_session.urls")),
    path("api/study_session/", include("study_session.api_urls")),
    # Redirect the site root to the study_session list page
    path('', RedirectView.as_view(url='/study_session/', permanent=False)),
]