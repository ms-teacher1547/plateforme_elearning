from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Exam, Question, Choice, StudentExamResult
from .serializers import ExamSerializer, QuestionSerializer, ResultSerializer

class ExamViewSet(viewsets.ModelViewSet):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer

    # --- NOUVELLE ACTION : CORRECTION AUTOMATIQUE ---
    @action(detail=True, methods=['post'])
    def submit(self, request, pk=None):
        exam = self.get_object() # On récupère l'examen concerné
        student = request.user # L'étudiant connecté
        
        # --- SECURITÉ : VERIRICATION DE TENTATIVE DE RE-SOUMISSION ---
        if StudentExamResult.objects.filter(student=student, exam=exam).exists():
            return Response(
                {'message': 'Vous avez déjà passé cet examen. Une seule tentative est autorisée !'},
                status=status.HTTP_403_FORBIDDEN # Code 403 (FORBIDDEN) pour indiquer que l'action est interdite
            )
        # -----------------------------------------------------------------------
            
        
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
    

class ResultViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = ResultSerializer
    
    def get_queryset(self):
        user = self.request.user
        
        # Si c'est un Étudiant : il ne voit que SES résultats
        if user.role == 'STUDENT':
            return StudentExamResult.objects.filter(student=user)
        
        # Si c'est un Enseignant : il voit les résultats des examens liés à SES cours
        elif user.role == 'TEACHER':
            return StudentExamResult.objects.filter(exam__course__teacher=user)
            
        # Si Admin : Il voit tout
        elif user.role == 'ADMIN' or user.is_superuser:
            return StudentExamResult.objects.all()
            
        return StudentExamResult.objects.none()