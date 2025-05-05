import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import './Premios.css';

export default function Premios() {
  const [premios, setPremios] = useState([]);
  const [editando, setEditando] = useState(null);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevosPuntos, setNuevosPuntos] = useState(0);

  useEffect(() => {
    const obtenerPremios = async () => {
      const premiosRef = collection(db, 'premios');
      const snapshot = await getDocs(premiosRef);
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPremios(lista);
    };
    obtenerPremios();
  }, []);

  const editar = (premio) => {
    setEditando(premio.id);
    setNuevoNombre(premio.nombre);
    setNuevosPuntos(premio.puntos);
  };

  const guardar = async (id) => {
    const ref = doc(db, 'premios', id);
    await updateDoc(ref, {
      nombre: nuevoNombre,
      puntos: parseInt(nuevosPuntos)
    });
    setEditando(null);
    window.location.reload(); // para refrescar la lista
  };

  return (
    <div className="contenedor-premios">
      <h2>Editar Premios</h2>
      {premios.map((premio) => (
        <div key={premio.id} className="card-premio">
          {editando === premio.id ? (
            <>
              <input
                type="text"
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
              />
              <input
                type="number"
                value={nuevosPuntos}
                onChange={(e) => setNuevosPuntos(e.target.value)}
              />
              <button onClick={() => guardar(premio.id)}>Guardar</button>
            </>
          ) : (
            <>
              <h3>{premio.nombre}</h3>
              <p>{premio.puntos} puntos</p>
              {premio.imagen && (
                <img src={premio.imagen} alt={premio.nombre} className="imagen-premio" />
              )}
              <button onClick={() => editar(premio)}>Editar</button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
