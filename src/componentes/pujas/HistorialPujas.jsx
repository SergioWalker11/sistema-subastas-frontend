import { useState, useEffect } from 'react';
import { obtenerPujasSubasta } from '../../api/clienteApi';
import Cargador from '../comunes/Cargador';

function HistorialPujas({ subastaId }) {
  const [pujas, setPujas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => { cargarPujas(); }, [subastaId]);

  const cargarPujas = async () => {
    try { const r = await obtenerPujasSubasta(subastaId); setPujas(r.datos); }
    catch (err) { console.error(err); }
    finally { setCargando(false); }
  };

  if (cargando) return <Cargador />;
  if (pujas.length === 0) return <p className="historial-vacio">Aun no hay pujas</p>;

  return (
    <div className="historial-pujas">
      <table className="tabla-pujas">
        <thead>
          <tr><th>Usuario</th><th>Monto</th><th>Fecha</th></tr>
        </thead>
        <tbody>
          {pujas.map((p) => (
            <tr key={p.id}>
              <td>{p.nombreUsuario}</td>
              <td className="monto-puja">${p.monto.toFixed(2)}</td>
              <td>{new Date(p.fechaCreacion).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default HistorialPujas;
