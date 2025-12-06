from rest_framework import viewsets
from rest_framework.exceptions import PermissionDenied # <--- IMPORTANT : Import pour l'erreur
from .models import Course, Lesson
from .serializers import CourseSerializer, LessonSerializer

class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def perform_create(self, serializer):
        # On assigne le prof automatiquement
        serializer.save(teacher=self.request.user)

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.all()
    serializer_class = LessonSerializer

    # --- SÉCURITÉ AJOUTÉE ---
    def perform_create(self, serializer):
        # On récupère le cours auquel on veut ajouter la leçon
        course = serializer.validated_data['course']
        
        # Vérification : Est-ce que le prof connecté est bien le propriétaire du cours ?
        # Note: On laisse passer les SuperAdmin (is_staff) au cas où
        if self.request.user != course.teacher and not self.request.user.is_staff:
            raise PermissionDenied("Vous ne pouvez pas modifier le cours d'un autre enseignant !")
            
        serializer.save()