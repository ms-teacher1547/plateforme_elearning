from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    # Définition des rôles
    ADMIN = 'ADMIN'
    TEACHER = 'TEACHER'
    STUDENT = 'STUDENT'

    ROLE_CHOICES = [
        (ADMIN, 'Administrateur'),
        (TEACHER, 'Enseignant'),
        (STUDENT, 'Etudiant'),
    ]

    # Champ rôle : Par défaut, un nouvel inscrit est un étudiant
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=STUDENT)
    
    # Photo de profil (Optionnel mais sympa pour l'UX)
    profile_photo = models.ImageField(verbose_name='Photo de profil', upload_to='profile_photos/', blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"