import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CourseDetail() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const navigate = useNavigate();
    const userRole = localStorage.getItem('user_role'); 
    const currentUsername = localStorage.getItem('user_username'); // Récupère le nom d'utilisateur courant

    // États pour le formulaire d'ajout de leçon
    const [showLessonForm, setShowLessonForm] = useState(false);
    const [newLesson, setNewLesson] = useState({ title: '', content: '', order: 1 });
    const [showExamForm, setShowExamForm] = useState(false);
    const [newExam, setNewExam] = useState({ title: '', description: '', duration_minutes: 30 });

    // Fonction pour charger le cours (on la sort pour pouvoir la rappeler après un ajout)
    const fetchCourseDetail = async () => {
        const token = localStorage.getItem('access_token');
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/courses/${id}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCourse(response.data);
            // On pré-remplit l'ordre de la prochaine leçon (s'il y en a 3, la prochaine sera la 4)
            if (response.data.lessons && response.data.lessons.length > 0) {
                setNewLesson(prev => ({ ...prev, order: response.data.lessons.length + 1 }));
            }
        } catch (err) {
            console.error("Erreur", err);
            alert("Impossible de charger ce cours.");
            navigate('/dashboard');
        }
    };

    useEffect(() => {
        fetchCourseDetail();
    }, [id, navigate]);

    // Fonction pour envoyer la nouvelle leçon
    const handleAddLesson = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        try {
            await axios.post('http://127.0.0.1:8000/api/lessons/', {
                ...newLesson,
                course: id // On lie la leçon à ce cours
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            alert("Leçon ajoutée !");
            setShowLessonForm(false); // On cache le formulaire
            setNewLesson({ title: '', content: '', order: newLesson.order + 1 }); // On reset
            fetchCourseDetail(); // On rafraîchit la page pour voir la leçon apparaître
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'ajout de la leçon.");
        }
    };

    const handleAddExam = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        try {
            await axios.post('http://127.0.0.1:8000/api/exams/', {
                ...newExam,
                course: id
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert("Examen créé !");
            setShowExamForm(false);
            setNewExam({ title: '', description: '', duration_minutes: 30 });
            fetchCourseDetail();
        } catch (err) {
            console.error(err);
            alert("Erreur création examen.");
        }
    };

    if (!course) return <p style={{padding: '20px'}}>Chargement...</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', cursor: 'pointer' }}>
                ← Retour
            </button>
            
            <h1 style={{ color: '#333' }}>{course.title}</h1>
            <p style={{ fontStyle: 'italic', color: '#666' }}>Enseignant : {course.teacher_name}</p>
            <p>{course.description}</p>

            {/* --- ZONE PROFESSEUR : AJOUTER CONTENU --- */}
            {userRole === 'TEACHER' && currentUsername === course.teacher_name && (
                <div style={{ backgroundColor: '#e9ecef', padding: '15px', borderRadius: '5px', marginBottom: '20px', border: '1px solid #ced4da' }}>
                    <h3 style={{ marginTop: 0 }}>Gestion du Cours</h3>
                    
                    <button 
                        onClick={() => setShowLessonForm(!showLessonForm)}
                        style={{ backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
                    >
                        {showLessonForm ? 'Annuler' : '+ Ajouter une Leçon'}
                    </button>
                    
                    {/* Bouton ACTIF */}
                <button 
                    onClick={() => setShowExamForm(!showExamForm)}
                    style={{ backgroundColor: '#6f42c1', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {showExamForm ? 'Annuler' : '+ Créer un Examen'}
                </button>

                {/* Formulaire EXAMEN */}
                {showExamForm && (
                    <form onSubmit={handleAddExam} style={{ marginTop: '15px', backgroundColor: 'white', padding: '15px', borderRadius: '5px', border: '1px solid #6f42c1' }}>
                        <h4 style={{marginTop: 0}}>Nouvel Examen</h4>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Titre :</label>
                            <input 
                                type="text" required style={{ width: '100%', padding: '5px' }}
                                value={newExam.title}
                                onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Durée (minutes) :</label>
                            <input 
                                type="number" required style={{ width: '100%', padding: '5px' }}
                                value={newExam.duration_minutes}
                                onChange={(e) => setNewExam({...newExam, duration_minutes: parseInt(e.target.value)})}
                            />
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Description / Consignes :</label>
                            <textarea 
                                style={{ width: '100%', padding: '5px' }}
                                value={newExam.description}
                                onChange={(e) => setNewExam({...newExam, description: e.target.value})}
                            />
                        </div>
                        <button type="submit" style={{ backgroundColor: '#6f42c1', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                            Créer l'examen
                        </button>
                    </form>
                    )}

                    {/* Le Formulaire qui s'ouvre */}
                    {showLessonForm && (
                        <form onSubmit={handleAddLesson} style={{ marginTop: '15px', backgroundColor: 'white', padding: '15px', borderRadius: '5px' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Titre de la leçon :</label>
                                <input 
                                    type="text" 
                                    required 
                                    style={{ width: '100%', padding: '5px' }}
                                    value={newLesson.title}
                                    onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                                />
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Contenu :</label>
                                <textarea 
                                    required 
                                    rows="5"
                                    style={{ width: '100%', padding: '5px' }}
                                    value={newLesson.content}
                                    onChange={(e) => setNewLesson({...newLesson, content: e.target.value})}
                                />
                            </div>
                            <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                                Enregistrer la leçon
                            </button>
                        </form>
                    )}
                </div>
            )}
            {/* ----------------------------------------- */}

            {/* --- BLOC EXAMENS (Déjà codé) --- */}
            {course.exams && course.exams.length > 0 && (
                <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #c3e6cb', backgroundColor: '#d4edda', borderRadius: '5px' }}>
                    <h2 style={{ marginTop: 0, color: '#155724' }}>Evaluations</h2>
                    {course.exams.map(exam => (
                        <div key={exam.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span><strong>{exam.title}</strong> ({exam.duration_minutes} min)</span>
                            {userRole === 'STUDENT' ? (
                                <button onClick={() => navigate(`/exam/${exam.id}`)} style={{ backgroundColor: '#155724', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                                    Commencer
                                </button>
                            ) : (
                                <span style={{fontSize: '0.9em', color: '#666', fontStyle: 'italic'}}>(Vue seulement)</span>
                            )}
                        </div>
                    ))}
                </div>
            )}

            <h2>Leçons du cours</h2>
            {course.lessons && course.lessons.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {course.lessons.map((lesson) => (
                        <div key={lesson.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                            <h4>{lesson.order}. {lesson.title}</h4>
                            <div style={{ marginTop: '10px', whiteSpace: 'pre-wrap' }}>
                                {lesson.content}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>Aucune leçon pour l'instant.</p>
            )}
        </div>
    );
}

export default CourseDetail;