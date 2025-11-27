"""
API ROUTES for React Frontend

These routes expose JSON endpoints for authentication and
future app features

Django is purely the backend API now
"""
from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("api/signup/", views.api_signup, name="api_signup"),
    path("api/login/", views.api_login, name="api_login"),
    path('test_token/', views.test_token),
    path("api/ping/", views.ping, name="ping"),
]