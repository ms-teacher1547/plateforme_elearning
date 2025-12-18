from rest_framework import serializers
from .models import Message
from users.serializers import UserSerializer # Pour avoir les infos simples des users

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.username', read_only=True)
    receiver_name = serializers.CharField(source='receiver.username', read_only=True)

    class Meta:
        model = Message
        fields = ['id', 'sender', 'sender_name', 'receiver', 'receiver_name', 'content', 'timestamp', 'is_read']
        read_only_fields = ['sender', 'timestamp'] # L'expéditeur est auto-déterminé, le temps aussi