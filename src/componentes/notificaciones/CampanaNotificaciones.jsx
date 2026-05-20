import { useState, useEffect } from 'react';
import { obtenerNotificaciones, marcarNotificacionLeida, contarNotificacionesNoLeidas } from '../../api/clienteApi';
import ListaNotificaciones from './ListaNotificaciones';

function CampanaNotificaciones() {
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [mostrarLista, setMostrarLista] = useState(false);

  useEffect(() => { cargarNotificaciones(); }, []);

  const cargarNotificaciones = async () => {
    try {
      const [r1, r2] = await Promise.all([obtenerNotificaciones(1), contarNotificacionesNoLeidas(1)]);
      setNotificaciones(r1.datos); setNoLeidas(r2.datos.cantidad);
    } catch (err) { console.error(err); }
  };

  const handleMarcarLeida = async (id) => {
    try { await marcarNotificacionLeida(id); setNoLeidas((p) => Math.max(0, p - 1)); cargarNotificaciones(); }
    catch (err) { console.error(err); }
  };

  return (
    <div className="campana-notificaciones">
      <button className="campana-boton" onClick={() => setMostrarLista(!mostrarLista)}>
        <span>&#128276;</span>
        {noLeidas > 0 && <span className="campana-badge">{noLeidas}</span>}
      </button>
      {mostrarLista && (
        <div className="campana-desplegable">
          <ListaNotificaciones notificaciones={notificaciones} onMarcarLeida={handleMarcarLeida} />
        </div>
      )}
    </div>
  );
}

export default CampanaNotificaciones;
