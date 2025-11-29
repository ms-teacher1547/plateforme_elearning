from django.db import models
from django.conf import settings
from courses.models import Course # On a besoin de lier l'examen à un cours

class Exam(models.Model):
    title = models.CharField(max_length=200, verbose_name="Titre de l'examen")
    description = models.TextField(blank=True, verbose_name="Consignes")
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='exams')
    
    # Gestion du temps (Optionnel mais recommandé dans le cahier des charges)
    duration_minutes = models.PositiveIntegerField(default=30, verbose_name="Durée (minutes)")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} ({self.course.title})"

class Question(models.Model):
    # Types de questions
    QCM = 'QCM'
    TEXT = 'TEXT'
    
    QUESTION_TYPES = [
        (QCM, 'Choix Multiple'),
        (TEXT, 'Réponse Libre'),
    ]

    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='questions')
    text = models.TextField(verbose_name="Énoncé de la question")
    question_type = models.CharField(max_length=10, choices=QUESTION_TYPES, default=QCM)
    points = models.FloatField(default=1.0, verbose_name="Points")

    def __str__(self):
        return self.text[:50]

class Choice(models.Model):
    # Uniquement pour les QCM
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='choices')
    text = models.CharField(max_length=200, verbose_name="Option de réponse")
    is_correct = models.BooleanField(default=False, verbose_name="Est-ce la bonne réponse ?")

    def __str__(self):
        return self.text

class StudentExamResult(models.Model):
    student = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='exam_results')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='results')
    score = models.FloatField(verbose_name="Note obtenue")
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Résultat d'examen"

    def __str__(self):
        return f"{self.student.username} - {self.exam.title}: {self.score}"