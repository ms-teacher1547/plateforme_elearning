from rest_framework import serializers # <--- C'est la ligne qu'il manquait !
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from users.models import User

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # On ajoute des infos supplémentaires dans la réponse JSON
        data['role'] = self.user.role
        data['username'] = self.user.username
        return data

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])

    class Meta:
        model = User
        fields = ['username', 'password', 'email', 'role'] # L'utilisateur choisit son rôle

    def create(self, validated_data):
        # Cette fonction est magique : elle crée l'utilisateur de façon sécurisée
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            role=validated_data['role']
        )
        return user