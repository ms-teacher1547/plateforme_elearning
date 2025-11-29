import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault(); // Empêche la page de se recharger
        setError('');

        try {
            // 1. On envoie les infos à Django
            const response = await axios.post('http://127.0.0.1:8000/api/token/', {
                username: username,
                password: password
            });

            

            // 2. Si ça marche, Django nous renvoie les tokens
            console.log("Succès :", response.data);

            // 3. On stocke le token d'accès dans le navigateur (localStorage)
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            localStorage.setItem('user_role', response.data.role); // Stocke le rôle de l'utilisateur

            // 4. On redirige l'utilisateur vers la page d'accueil (ou dashboard)
            alert("Connexion réussie !");
            navigate('/dashboard'); // On créera cette page juste après

        } catch (err) {
            console.error("Erreur de connexion", err);
            setError('Identifiants incorrects via Django');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Connexion</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Nom d'utilisateur :</label>
                    <input 
                        type="text" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Mot de passe :</label>
                    <input 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                    />
                </div>
                <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', cursor: 'pointer' }}>
                    Se connecter
                </button>
            </form>
        </div>
    );
}

export default Login;