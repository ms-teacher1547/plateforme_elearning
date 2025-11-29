from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        # On ajoute des infos supplémentaires dans la réponse JSON
        data['role'] = self.user.role
        data['username'] = self.user.username
        return data