import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import { useState } from 'react';

function App() {
  const [autenticado, setAutenticado] = useState(localStorage.getItem('admin-log') === 'true');

  const handleLogin = (email, pass) => {
    if (email === 'admin@estilomujer.com' && pass === '123456') {
      localStorage.setItem('admin-log', 'true');
      setAutenticado(true);
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-log');
    setAutenticado(false);
  };

  return (
    <Router>
      <Routes>
        {!autenticado ? (
          <Route path="*" element={<Login onLogin={handleLogin} />} />
        ) : (
          <>
            <Route path="/" element={<Dashboard onLogout={handleLogout} />} />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
