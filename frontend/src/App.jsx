import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';

// Un petit composant Dashboard temporaire pour tester la redirection
function Dashboard() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Tableau de Bord</h1>
      <p>Bienvenue dans votre espace étudiant !</p>
      <button onClick={() => {
        localStorage.clear();
        window.location.href = '/login';
      }}>Se déconnecter</button>
    </div>
  );
}

function App() {
  return (
    <Router>
      <nav style={{ padding: '10px', backgroundColor: '#eee', marginBottom: '20px' }}>
        <Link to="/login" style={{ marginRight: '10px' }}>Connexion</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<div style={{padding: '20px'}}><h1>Bienvenue sur E-Learning</h1><p>Veuillez vous connecter.</p></div>} />
      </Routes>
    </Router>
  )
}

export default App