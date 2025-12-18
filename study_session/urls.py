from django.urls import path
from . import views

urlpatterns = [
    path('', views.session_list, name='session_list'),
    path('start/', views.start_session, name='start_session'),
    path('end/<int:session_id>/', views.end_session, name='end_session'),
    path('detail/<int:session_id>/', views.session_detail, name='session_detail'),
]