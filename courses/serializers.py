from rest_framework import serializers
from .models import Course, Lesson

class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'order']

class CourseSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, read_only=True)
    teacher_name = serializers.CharField(source='teacher.username', read_only=True) # Pour afficher le nom du prof

    class Meta:
        model = Course
        fields = ['id', 'title', 'description', 'teacher_name', 'created_at', 'lessons']