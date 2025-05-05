import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './Clientas.css';

export default function Clientas() {
  const [clientas, setClientas] = useState([]);

  useEffect(() => {
    const fetchClientas = async () => {
      const snapshot = await getDocs(collection(db, 'usuarios'));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setClientas(data);
    };

    fetchClientas();
  }, []);

  const exportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(clientas);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientas');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const dataBlob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(dataBlob, 'clientas.xlsx');
  };

  return (
    <div className="clientas-container">
      <div className="header-row">
        <h1 className="clientas-title">Lista de Clientas</h1>
        <button className="export-btn" onClick={exportarExcel}>
          Exportar a Excel
        </button>
      </div>

      <div className="clientas-list">
        {clientas.map((c) => (
          <div key={c.id} className="clienta-card">
            <p><strong>Nombre:</strong> {c.nombre || 'Sin nombre'}</p>
            <p><strong>Email:</strong> {c.email}</p>
            <p><strong>Puntos:</strong> {c.puntos ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
