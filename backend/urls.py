from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from courses.views import CourseViewSet, LessonViewSet
from exams.views import ExamViewSet, QuestionViewSet, ResultViewSet
from users.views import UserViewSet
from users.views import MyTokenObtainPairView, RegisterView

# Import pour JWT
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'exams', ExamViewSet)
router.register(r'results', ResultViewSet, basename='results')  # Ajout du ResultViewSet

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # Les endpoints pour obtenir le token (Login)
    #path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # ... les autres paths ...
    path('api/register/', RegisterView.as_view(), name='register'), # <--- NOUVELLE ROUTE
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # ...
]