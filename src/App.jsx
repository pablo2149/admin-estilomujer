import { useState, useEffect } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Login from './Login';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [historiales, setHistoriales] = useState({});
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const isLogged = localStorage.getItem('admin-logged');
    if (isLogged === 'true') {
      setLogged(true);
    }
  }, []);

  useEffect(() => {
    if (logged) {
      const fetchData = async () => {
        const usuariosSnapshot = await getDocs(collection(db, 'usuarios'));
        const usuariosList = usuariosSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const historialPromises = usuariosList.map(async (usuario) => {
          const historialSnapshot = await getDocs(collection(db, `usuarios/${usuario.id}/historial`));
          return historialSnapshot.docs.map((doc) => doc.data());
        });

        const historialData = await Promise.all(historialPromises);

        const historialMap = {};
        usuariosList.forEach((usuario, index) => {
          historialMap[usuario.id] = historialData[index];
        });

        setUsuarios(usuariosList);
        setHistoriales(historialMap);
      };

      fetchData();
    }
  }, [logged]);

  if (!logged) {
    return <Login onLogin={() => setLogged(true)} />;
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8f8f8', minHeight: '100vh', position: 'relative' }}>
      {/* Botón de cerrar sesión */}
      <button
        onClick={() => {
          localStorage.removeItem('admin-logged');
          window.location.reload();
        }}
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          padding: '10px 15px',
          backgroundColor: '#d10030',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Cerrar sesión
      </button>

      <h1>👩‍💼 Panel de Administración - Estilo Mujer</h1>
      <h2>Clientas registradas</h2>

      <table border="1" cellPadding="10" style={{ borderCollapse: 'collapse', marginTop: '1rem', width: '100%' }}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Puntos</th>
            <th>Historial</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.email}</td>
              <td>{usuario.puntos}</td>
              <td>
                <ul>
                  {historiales[usuario.id]?.map((h, i) => (
                    <li key={i}>
                      {h.nombre} - {h.puntos} puntos - {new Date(h.fecha).toLocaleDateString()}
                    </li>
                  )) ?? 'Cargando...'}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
