import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import '../Historial.css';

export default function Historial() {
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    const obtenerHistorial = async () => {
      const ref = collection(db, 'historial');
      const snapshot = await getDocs(ref);
      const lista = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistorial(lista);
    };
    obtenerHistorial();
  }, []);

  return (
    <div className="contenedor-historial">
      <h2>Historial de Canjes</h2>
      {historial.length === 0 ? (
        <p className="mensaje">No hay canjes registrados.</p>
      ) : (
        historial.map((item) => (
          <div key={item.id} className="card-historial">
            <h3>{item.nombre}</h3>
            <p>Canjeó: {item.puntos} puntos</p>
            <p>Fecha: {new Date(item.fecha).toLocaleDateString()}</p>
          </div>
        ))
      )}
    </div>
  );
}
