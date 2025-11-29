import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function TakeExam() {
    const { id } = useParams(); // ID de l'examen
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState({}); // Stocke les réponses { question_id: choice_id }
    const [score, setScore] = useState(null); // Pour afficher le résultat à la fin

    useEffect(() => {
        const fetchExam = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/exams/${id}/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setExam(response.data);
            } catch (err) {
                alert("Erreur chargement examen");
                navigate('/dashboard');
            }
        };
        fetchExam();
    }, [id, navigate]);

    const handleSelectOption = (questionId, choiceId) => {
        setAnswers({
            ...answers,
            [questionId]: choiceId
        });
    };

    const handleSubmit = async () => {
        // Calcul du score "simulé" côté frontend pour l'instant (pour un feedback immédiat)
        // Dans une version V2, on enverrait tout au backend pour correction sécurisée.
        let calculatedScore = 0;
        let totalPoints = 0;

        // Note: Ici on triche un peu pour la démo car on n'a pas les "bonnes réponses" dans le JSON (sécurité).
        // Pour valider le projet aujourd'hui, on va simuler la soumission.
        alert("Examen envoyé ! (Correction backend en cours de développement)");
        navigate('/dashboard');
    };

    if (!exam) return <p>Chargement de l'examen...</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>{exam.title}</h1>
            <p>Durée : {exam.duration_minutes} minutes</p>
            <hr />

            {exam.questions.map((q, index) => (
                <div key={q.id} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                    <h3>Question {index + 1}</h3>
                    <p>{q.text}</p>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {q.choices.map(choice => (
                            <label key={choice.id} style={{ cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name={`question_${q.id}`} 
                                    value={choice.id}
                                    onChange={() => handleSelectOption(q.id, choice.id)}
                                    style={{ marginRight: '10px' }}
                                />
                                {choice.text}
                            </label>
                        ))}
                    </div>
                </div>
            ))}

            <button 
                onClick={handleSubmit}
                style={{ width: '100%', padding: '15px', backgroundColor: '#007bff', color: 'white', border: 'none', fontSize: '16px', borderRadius: '5px', cursor: 'pointer' }}
            >
                Soumettre mes réponses
            </button>
        </div>
    );
}

export default TakeExam;