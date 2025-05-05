
import { useEffect, useState } from 'react';
import { db } from './firebaseConfig';
import { collection, getDocs, doc, setDoc, addDoc } from 'firebase/firestore';
import axios from 'axios';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [premios, setPremios] = useState([]);
  const [nuevoPremio, setNuevoPremio] = useState({ nombre: '', puntos: '' });
  const [busqueda, setBusqueda] = useState('');

  const fetchUsuarios = async () => {
    const usuariosRef = collection(db, 'usuarios');
    const snapshot = await getDocs(usuariosRef);
    const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setUsuarios(lista);
  };

  const fetchPremios = async () => {
    const premiosRef = collection(db, 'premios');
    const snapshot = await getDocs(premiosRef);
    const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setPremios(lista);
  };

  useEffect(() => {
    fetchUsuarios();
    fetchPremios();
  }, []);

  const crearUsuarioDePrueba = async () => {
    const nuevoUsuario = {
      email: 'sofi@test.com',
      puntos: 150,
      pushToken: 'ExponentPushToken[SIMULADO123456]'
    };

    await setDoc(doc(db, 'usuarios', 'test-sofi'), nuevoUsuario);
    alert('Usuario de prueba creado');
    fetchUsuarios();
  };

  const enviarNotificacion = async (pushToken, email) => {
    if (!pushToken) {
      alert(`El usuario ${email} no tiene token push guardado`);
      return;
    }

    try {
      await axios.post('https://exp.host/--/api/v2/push/send', {
        to: pushToken,
        title: '🎁 ¡Promoción nueva!',
        body: `Hola ${email}, ¡ya podés canjear nuevos premios en Estilo Mujer!`
      });
      alert(`Notificación enviada a ${email}`);
    } catch (error) {
      console.error('Error al enviar notificación:', error);
      alert('Error al enviar la notificación');
    }
  };

  const notificarATodos = async () => {
    const usuariosRef = collection(db, 'usuarios');
    const snapshot = await getDocs(usuariosRef);

    const tokens = snapshot.docs
      .map(doc => doc.data().pushToken)
      .filter(token => token);

    if (tokens.length === 0) {
      alert('No hay tokens push registrados');
      return;
    }

    try {
      const mensajes = tokens.map(token => ({
        to: token,
        title: '✨ Novedades en Estilo Mujer',
        body: '¡No te pierdas los nuevos premios y promociones!'
      }));

      await Promise.all(mensajes.map(msg => axios.post('https://exp.host/--/api/v2/push/send', msg)));
      alert(`Se enviaron notificaciones a ${tokens.length} clientas 🎉`);
    } catch (error) {
      console.error('Error al enviar notificaciones:', error);
      alert('Hubo un error al enviar las notificaciones');
    }
  };

  const agregarPremio = async () => {
    if (!nuevoPremio.nombre || !nuevoPremio.puntos) {
      alert('Completa todos los campos');
      return;
    }

    await addDoc(collection(db, 'premios'), {
      nombre: nuevoPremio.nombre,
      puntos: parseInt(nuevoPremio.puntos)
    });

    setNuevoPremio({ nombre: '', puntos: '' });
    fetchPremios();
  };

  const usuariosFiltrados = usuarios
    .filter(usuario => usuario.email.toLowerCase().includes(busqueda.toLowerCase()))
    .sort((a, b) => b.puntos - a.puntos);

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>👩‍💼 Panel de Administración - Estilo Mujer</h1>

      <button onClick={crearUsuarioDePrueba}>➕ Crear usuaria de prueba</button>
      <button onClick={notificarATodos} style={{ marginLeft: '1rem' }}>📣 Notificar a todas</button>

      <h2 style={{ marginTop: '2rem' }}>Clientas registradas</h2>
      <input
        type="text"
        placeholder="Buscar por email..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ marginBottom: '1rem', padding: '0.5rem', width: '300px' }}
      />

      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Puntos</th>
            <th>Notificación</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map(usuario => (
            <tr key={usuario.id}>
              <td>{usuario.email}</td>
              <td>{usuario.puntos}</td>
              <td><button onClick={() => enviarNotificacion(usuario.pushToken, usuario.email)}>📩 Notificar</button></td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: '3rem' }}>🎁 Crear nuevo premio</h2>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Nombre del premio"
          value={nuevoPremio.nombre}
          onChange={(e) => setNuevoPremio({ ...nuevoPremio, nombre: e.target.value })}
        />
        <input
          type="number"
          placeholder="Puntos necesarios"
          value={nuevoPremio.puntos}
          onChange={(e) => setNuevoPremio({ ...nuevoPremio, puntos: e.target.value })}
          style={{ marginLeft: '1rem' }}
        />
        <button onClick={agregarPremio} style={{ marginLeft: '1rem' }}>✅ Agregar premio</button>
      </div>

      <h3>Premios actuales</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Puntos</th>
          </tr>
        </thead>
        <tbody>
          {premios.map(premio => (
            <tr key={premio.id}>
              <td>{premio.nombre}</td>
              <td>{premio.puntos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
