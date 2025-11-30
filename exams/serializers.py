from rest_framework import serializers
from .models import Exam, Question, Choice, StudentExamResult

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text'] 
        # Note : On ne renvoie pas 'is_correct' ici pour ne pas que l'étudiant puisse tricher en inspectant le code !

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True) # On inclut les choix dans la question

    class Meta:
        model = Question
        fields = ['id', 'text', 'question_type', 'points', 'choices']

class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Exam
        fields = ['id', 'title', 'description', 'duration_minutes', 'questions']
        

class ResultSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    exam_title = serializers.CharField(source='exam.title', read_only=True)
    
    class Meta:
        model = StudentExamResult
        fields = ['id', 'student_name', 'exam_title', 'score', 'submitted_at']