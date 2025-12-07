from rest_framework import serializers
from .models import Exam, Question, Choice, StudentExamResult

# --- SERIALIZERS POUR LA LECTURE (SÉCURISÉS - PAS DE RÉPONSES) ---

class ChoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text'] # Sécurité : Pas de is_correct ici !

class QuestionSerializer(serializers.ModelSerializer):
    choices = ChoiceSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'question_type', 'points', 'choices', 'exam']

class ExamSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Exam
        fields = ['id', 'title', 'description', 'duration_minutes', 'questions', 'course']

# --- SERIALIZERS POUR L'ÉCRITURE (PROFESSEUR - AVEC RÉPONSES) ---

class ChoiceWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Choice
        fields = ['id', 'text', 'is_correct'] # Ici on accepte is_correct

class QuestionWriteSerializer(serializers.ModelSerializer):
    # On utilise le serializer qui accepte les réponses
    choices = ChoiceWriteSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'text', 'question_type', 'points', 'choices', 'exam']

    def create(self, validated_data):
        choices_data = validated_data.pop('choices')
        question = Question.objects.create(**validated_data)
        
        for choice_data in choices_data:
            Choice.objects.create(question=question, **choice_data)
            
        return question

# --- SERIALIZER POUR LES RÉSULTATS ---
class ResultSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.username', read_only=True)
    exam_title = serializers.CharField(source='exam.title', read_only=True)
    
    class Meta:
        model = StudentExamResult
        fields = ['id', 'student_name', 'exam_title', 'score', 'submitted_at']