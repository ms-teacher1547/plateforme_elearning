import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EditExam() {
    const { id } = useParams(); // ID de l'examen
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    
    // État pour la NOUVELLE question
    const [questionText, setQuestionText] = useState('');
    const [points, setPoints] = useState(1);
    // Par défaut, on met 2 choix vides
    const [choices, setChoices] = useState([
        { text: '', is_correct: false },
        { text: '', is_correct: false }
    ]);

    // Chargement de l'examen
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

    useEffect(() => { fetchExam(); }, [id]);

    // Gestion des champs de choix (réponses)
    const handleChoiceChange = (index, field, value) => {
        const newChoices = [...choices];
        newChoices[index][field] = value;
        setChoices(newChoices);
    };

    const addChoiceField = () => {
        setChoices([...choices, { text: '', is_correct: false }]);
    };

    // Envoi du formulaire
    const handleAddQuestion = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');

        // On prépare le paquet JSON
        const payload = {
            exam: id,
            text: questionText,
            question_type: 'QCM',
            points: points,
            choices: choices // Le tableau complet
        };

        try {
            await axios.post('http://127.0.0.1:8000/api/questions/', payload, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert("Question ajoutée !");
            // Reset du formulaire
            setQuestionText('');
            setChoices([{ text: '', is_correct: false }, { text: '', is_correct: false }]);
            fetchExam(); // On rafraîchit la liste
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'ajout (Vérifiez que vous avez coché au moins une bonne réponse ?)");
        }
    };

    if (!exam) return <p>Chargement...</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate(`/course/${exam.course}`)} style={{ marginBottom: '20px' }}>← Retour au cours</button>
            
            <h1>Édition : {exam.title}</h1>
            <p>Ajoutez des questions à votre examen.</p>

            {/* LISTE DES QUESTIONS EXISTANTES */}
            <div style={{ marginBottom: '30px' }}>
                <h3>Questions existantes ({exam.questions.length})</h3>
                {exam.questions.map((q, idx) => (
                    <div key={q.id} style={{ border: '1px solid #ddd', padding: '10px', marginBottom: '10px', backgroundColor: '#f9f9f9' }}>
                        <strong>{idx + 1}. {q.text}</strong> ({q.points} pts)
                        <ul style={{ marginTop: '5px', paddingLeft: '20px' }}>
                            {q.choices.map(c => (
                                <li key={c.id} style={{ color: c.is_correct ? 'green' : 'black' }}>
                                    {c.text} {c.is_correct && "(Vrai)"}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            {/* FORMULAIRE D'AJOUT */}
            <div style={{ border: '2px solid #007bff', padding: '20px', borderRadius: '8px' }}>
                <h3 style={{ marginTop: 0, color: '#007bff' }}>+ Nouvelle Question QCM</h3>
                <form onSubmit={handleAddQuestion}>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Énoncé de la question :</label>
                        <input type="text" required style={{ width: '100%', padding: '8px' }} 
                            value={questionText} onChange={e => setQuestionText(e.target.value)} />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Points :</label>
                        <input type="number" step="0.5" required style={{ width: '100px', padding: '8px' }} 
                            value={points} onChange={e => setPoints(e.target.value)} />
                    </div>

                    <h4>Réponses possibles :</h4>
                    {choices.map((choice, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '5px', alignItems: 'center' }}>
                            <input 
                                type="text" placeholder={`Réponse ${index + 1}`} required 
                                value={choice.text} onChange={e => handleChoiceChange(index, 'text', e.target.value)}
                                style={{ flex: 1, padding: '5px' }}
                            />
                            <label style={{ fontSize: '0.9em', cursor: 'pointer' }}>
                                <input 
                                    type="checkbox" 
                                    checked={choice.is_correct} 
                                    onChange={e => handleChoiceChange(index, 'is_correct', e.target.checked)}
                                /> Bonne réponse ?
                            </label>
                        </div>
                    ))}
                    <button type="button" onClick={addChoiceField} style={{ marginBottom: '15px', fontSize: '0.9em' }}>+ Ajouter un choix</button>
                    <br/>
                    <button type="submit" style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}>
                        Enregistrer la Question
                    </button>
                </form>
            </div>
        </div>
    );
}

export default EditExam;