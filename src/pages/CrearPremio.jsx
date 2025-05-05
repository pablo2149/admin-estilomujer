import React, { useState } from 'react';
import { db, storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import './CrearPremio.css';

function CrearPremio() {
  const [nombre, setNombre] = useState('');
  const [puntos, setPuntos] = useState('');
  const [imagen, setImagen] = useState(null);
  const [mensaje, setMensaje] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nombre || !puntos || !imagen) {
      setMensaje('Por favor completá todos los campos.');
      return;
    }

    try {
      const imagenRef = ref(storage, `premios/${imagen.name}`);
      await uploadBytes(imagenRef, imagen);
      const imagenURL = await getDownloadURL(imagenRef);

      await addDoc(collection(db, 'premios'), {
        nombre,
        puntos: parseInt(puntos),
        imagen: imagenURL,
      });

      setMensaje('Premio creado correctamente 🎉');
      setNombre('');
      setPuntos('');
      setImagen(null);
    } catch (error) {
      setMensaje('Error al crear el premio.');
      console.error(error);
    }
  };

  return (
    <div className="crear-premio-container">
      <h2>Crear Premio</h2>
      <form onSubmit={handleSubmit} className="crear-premio-form">
        <input
          type="text"
          placeholder="Nombre del premio"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Puntos necesarios"
          value={puntos}
          onChange={(e) => setPuntos(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImagen(e.target.files[0])}
        />
        <button type="submit">Crear premio</button>
        {mensaje && <p className="mensaje">{mensaje}</p>}
      </form>
    </div>
  );
}

export default CrearPremio;
