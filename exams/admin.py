from django.contrib import admin
from .models import Exam, Question, Choice, StudentExamResult

# Permet d'ajouter des choix DIRECTEMENT dans la page de la Question
class ChoiceInline(admin.TabularInline):
    model = Choice
    extra = 3 # Affiche 3 champs de réponse par défaut

@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [ChoiceInline] # On intègre les choix ici
    list_display = ('text', 'exam', 'question_type', 'points')

# Permet d'ajouter des questions (simplifiées) dans la page de l'Examen
class QuestionInline(admin.TabularInline):
    model = Question
    extra = 1
    show_change_link = True # Permet de cliquer pour éditer les détails (comme les choix)

@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    inlines = [QuestionInline]
    list_display = ('title', 'course', 'duration_minutes')

@admin.register(StudentExamResult)
class StudentExamResultAdmin(admin.ModelAdmin):
    list_display = ('student', 'exam', 'score', 'submitted_at')