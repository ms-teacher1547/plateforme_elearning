from django.db import models
from django.conf import settings # Important pour lier à notre User personnalisé

class Course(models.Model):
    title = models.CharField(max_length=200, verbose_name="Titre")
    description = models.TextField(verbose_name="Description")
    # Relation : Un cours est créé par UN enseignant
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='courses_created',
        limit_choices_to={'role': 'TEACHER'} # Sécurité : Seuls les profs peuvent être sélectionnés
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title

class Lesson(models.Model):
    # Relation : Une leçon appartient à UN cours
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='lessons')
    title = models.CharField(max_length=200, verbose_name="Titre de la leçon")
    content = models.TextField(verbose_name="Contenu", help_text="Texte, liens vidéo ou HTML")
    order = models.PositiveIntegerField(default=0, verbose_name="Ordre") # Pour ordonner les leçons (1, 2, 3...)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.course.title} - {self.title}"

class Enrollment(models.Model):
    # Relation : Un étudiant s'inscrit à un cours
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE, 
        related_name='enrollments'
    )
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='students')
    enrolled_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        # Contrainte unique : Un étudiant ne peut pas s'inscrire deux fois au même cours
        unique_together = ('student', 'course') 
        verbose_name = "Inscription"

    def __str__(self):
        return f"{self.student.username} -> {self.course.title}"