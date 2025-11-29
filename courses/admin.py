from django.contrib import admin
from .models import Course, Lesson, Enrollment

# Cette classe permet d'ajouter des leçons directement dans la page du Cours
class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1 # Affiche 1 ligne vide par défaut pour ajouter une leçon

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'teacher', 'created_at')
    search_fields = ('title', 'description')
    inlines = [LessonInline] # On intègre les leçons ici

@admin.register(Enrollment)
class EnrollmentAdmin(admin.ModelAdmin):
    list_display = ('student', 'course', 'enrolled_at')