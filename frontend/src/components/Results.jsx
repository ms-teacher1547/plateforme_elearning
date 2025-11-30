import { useEffect, useState } from 'react';
import axios from 'axios';

function Results() {
    const [results, setResults] = useState([]);
    const [userRole, setUserRole] = useState('');

    useEffect(() => {
        // 1. On récupère le rôle pour savoir quoi afficher dans le titre
        const role = localStorage.getItem('user_role');
        setUserRole(role);

        // 2. On récupère les données depuis l'API
        const fetchResults = async () => {
            const token = localStorage.getItem('access_token');
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/results/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                setResults(response.data);
            } catch (err) {
                console.error("Erreur", err);
            }
        };

        fetchResults();
    }, []);

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
                {userRole === 'TEACHER' ? 'Résultats des Étudiants' : 'Mes Notes'}
            </h1>

            {results.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#666' }}>Aucun résultat disponible.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', boxShadow: '0 0 20px rgba(0,0,0,0.1)' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#009879', color: '#ffffff', textAlign: 'left' }}>
                            <th style={{ padding: '12px 15px' }}>Examen</th>
                            {/* Le prof voit le nom de l'élève, l'élève n'a pas besoin de voir son propre nom partout */}
                            {userRole === 'TEACHER' && <th style={{ padding: '12px 15px' }}>Étudiant</th>}
                            <th style={{ padding: '12px 15px' }}>Note</th>
                            <th style={{ padding: '12px 15px' }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map((result) => (
                            <tr key={result.id} style={{ borderBottom: '1px solid #dddddd' }}>
                                <td style={{ padding: '12px 15px' }}>{result.exam_title}</td>
                                
                                {userRole === 'TEACHER' && (
                                    <td style={{ padding: '12px 15px', fontWeight: 'bold' }}>{result.student_name}</td>
                                )}
                                
                                <td style={{ padding: '12px 15px' }}>
                                    <span style={{ 
                                        backgroundColor: result.score >= 10 ? '#c3e6cb' : '#f8d7da', 
                                        color: result.score >= 10 ? '#155724' : '#721c24',
                                        padding: '5px 10px', 
                                        borderRadius: '15px',
                                        fontWeight: 'bold'
                                    }}>
                                        {result.score} pts
                                    </span>
                                </td>
                                <td style={{ padding: '12px 15px', color: '#666' }}>
                                    {new Date(result.submitted_at).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Results;