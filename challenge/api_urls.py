from rest_framework.routers import DefaultRouter
from .api_views import ChallengeViewSet

router = DefaultRouter()
router.register(r'', ChallengeViewSet, basename='challenge')

urlpatterns = router.urls