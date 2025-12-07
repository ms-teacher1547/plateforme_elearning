from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet, MyTokenObtainPairView, RegisterView, ActivateAccountView
from rest_framework_simplejwt.views import TokenRefreshView

# Imports des Vues (Courses et Exams)
from courses.views import CourseViewSet, LessonViewSet # <--- Vérifiez que LessonViewSet est là
from exams.views import ExamViewSet, QuestionViewSet, ResultViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'courses', CourseViewSet)
router.register(r'exams', ExamViewSet)
router.register(r'results', ResultViewSet, basename='results')
router.register(r'lessons', LessonViewSet) 
router.register(r'questions', QuestionViewSet)  # Ajout du routeur pour les questions

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    
    # Auth & Inscription
    path('api/token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/activate/<uidb64>/<token>/', ActivateAccountView.as_view(), name='activate'),
]