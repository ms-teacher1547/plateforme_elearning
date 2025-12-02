import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        role: 'STUDENT' // Par défaut, on inscrit un étudiant
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://127.0.0.1:8000/api/register/', formData);
            alert("Compte créé avec succès ! Connectez-vous maintenant.");
            navigate('/login');
        } catch (err) {
            console.error(err);
            alert("Erreur lors de l'inscription (Vérifiez que le nom d'utilisateur n'existe pas déjà).");
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Créer un compte</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Nom d'utilisateur :</label>
                    <input type="text" name="username" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email :</label>
                    <input type="email" name="email" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Mot de passe :</label>
                    <input type="password" name="password" onChange={handleChange} required style={{ width: '100%', padding: '8px' }} />
                </div>
                
                {/* Choix du Rôle */}
                <div style={{ marginBottom: '15px' }}>
                    <label>Je suis un :</label>
                    <select name="role" onChange={handleChange} value={formData.role} style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
                        <option value="STUDENT">Étudiant</option>
                        <option value="TEACHER">Enseignant</option>
                    </select>
                </div>

                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                    S'inscrire
                </button>
            </form>
            <p style={{ marginTop: '15px', textAlign: 'center' }}>
                Déjà un compte ? <Link to="/login">Se connecter</Link>
            </p>
        </div>
    );
}

export default Register;