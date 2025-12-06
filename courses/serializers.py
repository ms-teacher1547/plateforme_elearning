from rest_framework import serializers
from .models import Course, Lesson
from exams.models import Exam

# Serializer pour les examens (mini)
class ExamMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'title', 'duration_minutes']

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'order', 'course']

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    exams = ExamMiniSerializer(many=True, read_only=True)
    teacher_name = serializers.CharField(source='teacher.username', read_only=True) # Pour afficher le nom du prof

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'teacher_name', 'created_at', 'lessons', 'exams']
        # Pour que le champ teacher ne soit pas modifiable via l'API 
        read_only_fields = ['teacher']