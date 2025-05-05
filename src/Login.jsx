import { useState } from 'react';
import './Login.css';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Por ahora usamos credenciales fijas (puede ser reemplazado por Firebase Auth u otro backend)
    if (email === 'admin@estilomujer.com' && password === 'estilo123') {
      localStorage.setItem('adminLoggedIn', 'true');
      onLogin(true);
    } else {
      alert('Credenciales incorrectas. Intente nuevamente.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Panel Estilo Mujer</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Ingresar</button>
        </form>
      </div>
    </div>
  );
}
