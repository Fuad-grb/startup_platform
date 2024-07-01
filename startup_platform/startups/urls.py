from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import StartupViewSet, StartupUpdateViewSet, EventViewSet
from users.views import UserAchievementViewSet

router = DefaultRouter()
router.register(r'startups', StartupViewSet)
router.register(r'startup-updates', StartupUpdateViewSet)
router.register(r'user-achievements', UserAchievementViewSet, basename='user-achievement')
router.register(r'events', EventViewSet)

urlpatterns = [
    path('', include(router.urls)),
]