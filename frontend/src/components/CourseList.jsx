import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CourseList() {
    const [courses, setCourses] = useState([]);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Cette fonction se lance dès que la page s'ouvre
        const fetchCourses = async () => {
            const token = localStorage.getItem('access_token');

            // Sécurité : Si pas de token, on renvoie vers le login
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                // L'appel API vers Django AVEC le token
                const response = await axios.get('http://127.0.0.1:8000/api/courses/', {
                    headers: {
                        'Authorization': `Bearer ${token}` // C'est ici que la magie opère
                    }
                });
                
                // Si ça marche, on stocke les cours
                setCourses(response.data);
            } catch (err) {
                console.error("Erreur chargement cours", err);
                setError("Impossible de charger les cours. Votre session a peut-être expiré.");
                
                // Optionnel : Si le token est invalide, on déconnecte
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            }
        };

        fetchCourses();
    }, [navigate]);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h2>Liste des Cours Disponibles</h2>
            
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {courses.length === 0 && !error ? (
                <p>Chargement ou aucun cours disponible...</p>
            ) : (
                <div style={{ display: 'grid', gap: '20px' }}>
                    {courses.map(course => (
                        <div key={course.id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                            <h3 style={{ margin: '0 0 10px 0' }}>{course.title}</h3>
                            <p style={{ color: '#666' }}>{course.description}</p>
                            <p style={{ fontSize: '0.9em' }}><strong>Enseignant :</strong> {course.teacher_name}</p>
                            <button 
                                onClick={() => navigate(`/course/${course.id}`)}
                                style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                                Voir le cours
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default CourseList;