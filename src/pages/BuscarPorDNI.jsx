import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function BuscarPorDNI() {
  const [clientas, setClientas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [puntosASumar, setPuntosASumar] = useState({});

  useEffect(() => {
    const obtenerClientas = async () => {
      const querySnapshot = await getDocs(collection(db, 'usuarios'));
      const datos = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientas(datos);
    };

    obtenerClientas();
  }, []);

  const clientasFiltradas = clientas.filter((c) =>
    c.dni?.toString().includes(busqueda)
  );

  const agregarPuntos = async (id, puntosActuales, puntosExtra) => {
    const nuevosPuntos = puntosActuales + parseInt(puntosExtra);
    await updateDoc(doc(db, 'usuarios', id), {
      puntos: nuevosPuntos,
    });
    setPuntosASumar({ ...puntosASumar, [id]: '' });
    setClientas((prev) =>
      prev.map((c) => (c.id === id ? { ...c, puntos: nuevosPuntos } : c))
    );
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Buscar clienta por DNI</h2>
      <input
        type="text"
        placeholder="Escribí el DNI"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        style={{ padding: '8px', width: '300px', marginBottom: '20px' }}
      />

      {clientasFiltradas.map((clienta) => (
        <div key={clienta.id} style={{ marginBottom: 20, background: '#f9f9f9', padding: 10, borderRadius: 5 }}>
          <strong>{clienta.nombre}</strong><br />
          Email: {clienta.email}<br />
          DNI: {clienta.dni}<br />
          Puntos: {clienta.puntos}
          <div style={{ marginTop: 10 }}>
            <input
              type="number"
              placeholder="Puntos a sumar"
              value={puntosASumar[clienta.id] || ''}
              onChange={(e) =>
                setPuntosASumar({ ...puntosASumar, [clienta.id]: e.target.value })
              }
              style={{ padding: '4px', marginRight: '10px', width: '120px' }}
            />
            <button
              onClick={() =>
                agregarPuntos(clienta.id, clienta.puntos, puntosASumar[clienta.id])
              }
            >
              ➕ Agregar puntos
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
