import { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
} from 'firebase/firestore';

function Premios() {
  const [premios, setPremios] = useState([]);
  const [nuevoPremio, setNuevoPremio] = useState({ nombre: '', puntos: '' });

  const fetchPremios = async () => {
    const premiosRef = collection(db, 'premios');
    const snapshot = await getDocs(premiosRef);
    const lista = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPremios(lista);
  };

  useEffect(() => {
    fetchPremios();
  }, []);

  const agregarPremio = async () => {
    if (!nuevoPremio.nombre || !nuevoPremio.puntos) {
      alert('Completa todos los campos');
      return;
    }

    await addDoc(collection(db, 'premios'), {
      nombre: nuevoPremio.nombre,
      puntos: parseInt(nuevoPremio.puntos),
    });

    setNuevoPremio({ nombre: '', puntos: '' });
    fetchPremios();
  };

  const eliminarPremio = async (id) => {
    await deleteDoc(doc(db, 'premios', id));
    fetchPremios();
  };

  const editarPremio = async (id, nuevoNombre, nuevosPuntos) => {
    await updateDoc(doc(db, 'premios', id), {
      nombre: nuevoNombre,
      puntos: nuevosPuntos,
    });
    fetchPremios();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🎁 Crear nuevo premio</h2>
      <input
        type="text"
        placeholder="Nombre del premio"
        value={nuevoPremio.nombre}
        onChange={(e) =>
          setNuevoPremio({ ...nuevoPremio, nombre: e.target.value })
        }
      />
      <input
        type="number"
        placeholder="Puntos necesarios"
        value={nuevoPremio.puntos}
        onChange={(e) =>
          setNuevoPremio({ ...nuevoPremio, puntos: e.target.value })
        }
        style={{ marginLeft: '1rem' }}
      />
      <button onClick={agregarPremio} style={{ marginLeft: '1rem' }}>
        ✅ Agregar
      </button>

      <h3 style={{ marginTop: '2rem' }}>Premios actuales</h3>
      <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Puntos</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {premios.map((premio) => (
            <tr key={premio.id}>
              <td>{premio.nombre}</td>
              <td>{premio.puntos}</td>
              <td>
                <button
                  onClick={() => {
                    const nuevoNombre = prompt('Nuevo nombre:', premio.nombre);
                    const nuevosPuntos = prompt(
                      'Nuevos puntos:',
                      premio.puntos
                    );
                    if (nuevoNombre && nuevosPuntos) {
                      editarPremio(premio.id, nuevoNombre, parseInt(nuevosPuntos));
                    }
                  }}
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => eliminarPremio(premio.id)}
                  style={{ marginLeft: '0.5rem' }}
                >
                  🗑️ Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Premios;
