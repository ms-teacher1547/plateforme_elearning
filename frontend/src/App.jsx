import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Login from './components/Login';
import CourseList from './components/CourseList';
import CourseDetail from './components/CourseDetail';
import TakeExam from './components/TakeExam';
import Results from './components/Results'; 
import Register from './components/Register';

function App() {
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <Router>
      <nav style={{ padding: '15px', backgroundColor: '#333', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.2em' }}>E-Learning</span>
            <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Cours</Link>
            <Link to="/results" style={{ color: 'white', textDecoration: 'none' }}>Résultats</Link> {/* <--- AJOUT 2 : Lien */}
        </div>
        <div>
            <button onClick={handleLogout} style={{ backgroundColor: '#d9534f', border: 'none', color: 'white', padding: '8px 15px', cursor: 'pointer', borderRadius: '4px' }}>
                Déconnexion
            </button>
        </div>
      </nav>

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<CourseList />} />
        <Route path="/course/:id" element={<CourseDetail />} />
        <Route path="/exam/:id" element={<TakeExam />} />
        <Route path="/results" element={<Results />} /> {/* <--- AJOUT 3 : Route */}
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<div style={{padding: '20px'}}><h1>Bienvenue</h1><p><Link to="/login">Connectez-vous</Link></p></div>} />
      </Routes>
    </Router>
  )
}

export default App