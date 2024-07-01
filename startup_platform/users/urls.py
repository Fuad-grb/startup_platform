from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CustomUserViewSet, RegisterView, UserProfileView

router = DefaultRouter()
router.register(r'', CustomUserViewSet)

urlpatterns = [
    path('me/', CustomUserViewSet.as_view({'get': 'me', 'patch': 'me'}), name='user-profile'),
    path('register/', RegisterView.as_view(), name='register'),
    path('', include(router.urls)),
]

print("Users app URLs:", urlpatterns)