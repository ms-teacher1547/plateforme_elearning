from rest_framework import generics, status, viewsets # <--- Ajout de viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from django.core.mail import send_mail
from django.conf import settings
from django.contrib.auth import get_user_model
from django.utils.encoding import force_bytes, force_str
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
# On importe aussi UserSerializer
from .serializers import UserRegistrationSerializer, MyTokenObtainPairSerializer, UserSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .utils import account_activation_token

User = get_user_model()

# 1. Pour lister les utilisateurs (C'est ce qui manquait !)
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# 2. Pour le Login
class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

# 3. Pour l'Inscription (flux email)
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # On désactive le compte
        user.is_active = False
        user.save()

        # Lien d'activation
        token = account_activation_token.make_token(user)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        activation_link = f"http://127.0.0.1:8000/api/activate/{uid}/{token}/"

        # Simulation envoi mail
        subject = 'Activez votre compte'
        message = f'Bonjour {user.username},\nLien : {activation_link}'
        
        try:
            send_mail(subject, message, settings.EMAIL_HOST_USER, [user.email], fail_silently=False)
        except Exception as e:
            print(f"Erreur mail: {e}")

        response_message = "Compte créé ! Vérifiez vos emails."
        if user.role == 'TEACHER':
            print(f"⚠️ [ADMIN] Nouvel enseignant {user.username} en attente !")
            response_message = "Compte créé ! Vérifiez email + Attente validation Admin."

        return Response({'message': response_message}, status=status.HTTP_201_CREATED)

# 4. Pour activer le compte via le lien email
class ActivateAccountView(APIView):
    permission_classes = (AllowAny,)

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)
        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            user = None

        if user is not None and account_activation_token.check_token(user, token):
            user.email_verified = True
            
            if user.role == 'STUDENT':
                user.is_active = True
                user.save()
                return Response({'message': 'Email vérifié ! Compte étudiant actif.'})
            elif user.role == 'TEACHER':
                user.save()
                return Response({'message': 'Email vérifié ! En attente validation Admin.'})
            
        else:
            return Response({'error': 'Lien invalide'}, status=status.HTTP_400_BAD_REQUEST)