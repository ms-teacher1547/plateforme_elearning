from rest_framework import viewsets
from .models import Exam, Question
from .serializers import ExamSerializer, QuestionSerializer

class ExamViewSet(viewsets.ModelViewSet):
    # Ce "guichet" permet de récupérer un examen (et ses questions grâce au serializer)
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer