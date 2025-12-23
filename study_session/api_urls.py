from rest_framework.routers import DefaultRouter
from .api_views import StudySessionViewSet

router = DefaultRouter()
router.register(r'', StudySessionViewSet, basename='study_session')

urlpatterns = router.urls
