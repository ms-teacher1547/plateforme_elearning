from rest_framework import viewsets
from .models import Course, Lesson
from .serializers import CourseSerializer, LessonSerializer

class CourseViewSet(viewsets.ModelViewSet):
    # Ce "guichet" donne accès à tous les cours
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    
    # Cette méthode est appelée lors de la création d'un nouveau cours
    # Elle permet d'associer le cours à l'utilisateur connecté (le professeur)
    def perform_create(self, serializer):
        # Associer le cours à l'utilisateur connecté
        serializer.save(teacher=self.request.user)

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer