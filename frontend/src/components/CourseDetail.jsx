import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CourseDetail() {
    const { id } = useParams();
    const [course, setCourse] = useState(null);
    const navigate = useNavigate();

    // On récupère le rôle stocké lors du login
    const userRole = localStorage.getItem('user_role'); 

    useEffect(() => {
        const fetchCourseDetail = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/courses/${id}/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setCourse(response.data);
            } catch (err) {
                console.error("Erreur", err);
                alert("Impossible de charger ce cours.");
                navigate('/dashboard');
            }
        };
        fetchCourseDetail();
    }, [id, navigate]);

    if (!course) return <p style={{padding: '20px'}}>Chargement du cours...</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px', cursor: 'pointer' }}>
                ← Retour aux cours
            </button>
            
            <h1 style={{ color: '#333' }}>{course.title}</h1>
            <p style={{ fontStyle: 'italic', color: '#666' }}>Enseignant : {course.teacher_name}</p>
            <div style={{ backgroundColor: '#f9f9f9', padding: '15px', borderRadius: '5px', marginBottom: '30px' }}>
                <h3>Description</h3>
                <p>{course.description}</p>
            </div>

            {/* --- BLOC EXAMENS --- */}
            {course.exams && course.exams.length > 0 && (
                <div style={{ marginBottom: '30px', padding: '15px', border: '1px solid #c3e6cb', backgroundColor: '#d4edda', borderRadius: '5px' }}>
                    <h2 style={{ marginTop: 0, color: '#155724' }}>Evaluations</h2>
                    {course.exams.map(exam => (
                        <div key={exam.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                            <span><strong>{exam.title}</strong> ({exam.duration_minutes} min)</span>
                            
                            {/* --- MODIFICATION ICI : CONDITION D'AFFICHAGE --- */}
                            {userRole === 'STUDENT' ? (
                                <button 
                                    onClick={() => navigate(`/exam/${exam.id}`)}
                                    style={{ backgroundColor: '#155724', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}
                                >
                                    Commencer l'examen
                                </button>
                            ) : (
                                <span style={{fontSize: '0.9em', color: '#666', fontStyle: 'italic'}}>
                                    (Mode {userRole} : Vue seulement)
                                </span>
                            )}
                            {/* ----------------------------------------------- */}

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
                <p>Aucune leçon disponible pour le moment.</p>
            )}
        </div>
    );
}

export default CourseDetail;