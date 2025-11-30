from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Exam, Question, Choice, StudentExamResult
from .serializers import ExamSerializer, QuestionSerializer

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

    # --- NOUVELLE ACTION : CORRECTION AUTOMATIQUE ---
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        exam = self.get_object() # On récupère l'examen concerné
        student = request.user # L'étudiant connecté
        
        # Les réponses envoyées par React : { "1": 4, "2": 8 } (QuestionID: ChoiceID)
        submitted_answers = request.data.get('answers', {})
        
        score = 0.0
        total_points = 0.0

        # On parcourt toutes les questions de l'examen
        for question in exam.questions.all():
            total_points += question.points
            
            # On regarde si l'étudiant a répondu à cette question
            # Note: les clés du JSON sont des strings, donc str(question.id)
            submitted_choice_id = submitted_answers.get(str(question.id))

            if submitted_choice_id:
                try:
                    # On vérifie si ce choix est le bon dans la base de données
                    choice = Choice.objects.get(id=submitted_choice_id, question=question)
                    if choice.is_correct:
                        score += question.points
                except Choice.DoesNotExist:
                    pass # Choix invalide, pas de points

        # On enregistre le résultat en base de données
        StudentExamResult.objects.create(
            student=student,
            exam=exam,
            score=score
        )

        return Response({
            'status': 'success',
            'score': score,
            'total_points': total_points,
            'message': f'Examen terminé ! Note : {score}/{total_points}'
        })

class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer