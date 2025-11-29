from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet # Nous allons créer ça juste après pour éviter une erreur
from courses.views import CourseViewSet
from exams.views import ExamViewSet

# Création du routeur
router = DefaultRouter()
router.register(r'courses', CourseViewSet)
router.register(r'exams', ExamViewSet)
# Nous ajouterons les users plus tard, je commente la ligne pour l'instant pour éviter le crash
router.register(r'users', UserViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)), # Toutes nos adresses commenceront par /api/
]