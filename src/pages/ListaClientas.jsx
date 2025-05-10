import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

export default function ListaClientas() {
  const [clientas, setClientas] = useState([]);
  const [busqueda, setBusqueda] = useState('');

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

  const clientasFiltradas = clientas.filter((clienta) =>
    clienta.dni?.toString().includes(busqueda)
  );

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
        <div key={clienta.id} style={{ marginBottom: '15px', background: '#f9f9f9', padding: 10, borderRadius: 5 }}>
          <strong>{clienta.nombre}</strong><br />
          Email: {clienta.email}<br />
          DNI: {clienta.dni}<br />
          Puntos: {clienta.puntos}
        </div>
      ))}
    </div>
  );
}
