import React, { useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import './Premios.css';

const Premios = () => {
  const [premios, setPremios] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'premios'), (snapshot) => {
      const premiosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPremios(premiosData);
    });

    return () => unsubscribe();
  }, []);

  const handleEdit = async (id, field, value) => {
    try {
      const ref = doc(db, 'premios', id);
      await updateDoc(ref, {
        [field]: field === 'puntos' ? Number(value) : value,
      });
    } catch (error) {
      console.error('Error actualizando el premio:', error);
    }
  };

  return (
    <div className="container-premios">
      <h2>Premios disponibles</h2>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Puntos necesarios</th>
          </tr>
        </thead>
        <tbody>
          {premios.map((premio) => (
            <tr key={premio.id}>
              <td>
                <input
                  type="text"
                  defaultValue={premio.nombre}
                  onBlur={(e) => handleEdit(premio.id, 'nombre', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  defaultValue={premio.puntos}
                  onBlur={(e) => handleEdit(premio.id, 'puntos', e.target.value)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Premios;
