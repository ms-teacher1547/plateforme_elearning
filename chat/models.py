from django.db import models
from django.conf import settings

class Message(models.Model):
    # Qui envoie ?
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    # À qui ?
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='received_messages')
    
    content = models.TextField(verbose_name="Message")
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False) # Pour savoir si le message a été lu (optionnel mais utile)

    class Meta:
        ordering = ['timestamp'] # Les plus vieux en premier (conversation chronologique)

    def __str__(self):
        return f"De {self.sender} à {self.receiver} ({self.timestamp})"