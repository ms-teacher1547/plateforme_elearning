from rest_framework import viewsets
from .models import User
from rest_framework.serializers import ModelSerializer

# Un serializer rapide juste pour le test
class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'role']

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer