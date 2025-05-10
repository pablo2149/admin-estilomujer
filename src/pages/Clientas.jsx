import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, getDocs, updateDoc, query, where, doc } from 'firebase/firestore';

export default function Clientas() {
  const [usuarios, setUsuarios] = useState([]);
  const [dniBusqueda, setDniBusqueda] = useState('');
  const [puntosACargar, setPuntosACargar] = useState('');
  const [usuarioEncontrado, setUsuarioEncontrado] = useState(null);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const usuariosRef = collection(db, 'usuarios');
      const snapshot = await getDocs(usuariosRef);
      const lista = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsuarios(lista);
    };

    fetchUsuarios();
  }, []);

  const buscarPorDni = async () => {
    const usuariosRef = collection(db, 'usuarios');
    const q = query(usuariosRef, where('dni', '==', dniBusqueda));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      alert('No se encontró ninguna clienta con ese DNI.');
      setUsuarioEncontrado(null);
      return;
    }

    const usuaria = snapshot.docs[0];
    setUsuarioEncontrado({ id: usuaria.id, ...usuaria.data() });
  };

  const cargarPuntos = async () => {
    if (!usuarioEncontrado) return;
    const usuariaRef = doc(db, 'usuarios', usuarioEncontrado.id);
    const nuevosPuntos = (usuarioEncontrado.puntos || 0) + parseInt(puntosACargar);

    await updateDoc(usuariaRef, { puntos: nuevosPuntos });
    alert(`Se cargaron ${puntosACargar} puntos a ${usuarioEncontrado.nombre || usuarioEncontrado.email}`);
    setUsuarioEncontrado(null);
    setDniBusqueda('');
    setPuntosACargar('');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🔍 Buscar clienta por DNI</h2>
      <input
        type="text"
        placeholder="DNI"
        value={dniBusqueda}
        onChange={(e) => setDniBusqueda(e.target.value)}
        style={{ marginRight: '1rem' }}
      />
      <button onClick={buscarPorDni}>Buscar</button>

      {usuarioEncontrado && (
        <div style={{ marginTop: '2rem' }}>
          <p><strong>Nombre:</strong> {usuarioEncontrado.nombre}</p>
          <p><strong>Email:</strong> {usuarioEncontrado.email}</p>
          <p><strong>Puntos actuales:</strong> {usuarioEncontrado.puntos ?? 0}</p>

          <input
            type="number"
            placeholder="Puntos a cargar"
            value={puntosACargar}
            onChange={(e) => setPuntosACargar(e.target.value)}
            style={{ marginRight: '1rem' }}
          />
          <button onClick={cargarPuntos}>➕ Cargar puntos</button>
        </div>
      )}
    </div>
  );
}
