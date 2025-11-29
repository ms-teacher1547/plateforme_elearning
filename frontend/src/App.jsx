import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import CourseList from './components/CourseList'; // Importez le nouveau composant
import CourseDetail from './components/CourseDetail';
import TakeExam from './components/TakeExam';

function App() {
  const handleLogout = () => {
    localStorage.clear(); // On supprime le token
    window.location.href = '/login';
  };

  return (
    <Router>
      <nav style={{ padding: '15px', backgroundColor: '#333', color: 'white', display: 'flex', justifyContent: 'space-between' }}>
        <div>
            <span style={{ fontWeight: 'bold', marginRight: '20px' }}>E-Learning</span>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Cours</Link>
        </div>
        <div>
            <Link to="/login" style={{ color: 'white', textDecoration: 'none', marginRight: '15px' }}>Connexion</Link>
            <button onClick={handleLogout} style={{ backgroundColor: '#d9534f', border: 'none', color: 'white', padding: '5px 10px', cursor: 'pointer', borderRadius: '4px' }}>
                Déconnexion
            </button>
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        {/* On remplace le dashboard temporaire par la liste des cours */}
        <Route path="/dashboard" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/exam/:id" element={<TakeExam />} />
        <Route path="/" element={<div style={{padding: '20px'}}><h1>Bienvenue</h1><p>Connectez-vous pour voir les cours.</p></div>} />
      </Routes>
    </Router>
  )
}

export default App