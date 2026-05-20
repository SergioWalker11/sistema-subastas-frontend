import { useState, useEffect } from 'react';
import { obtenerPagosUsuario } from '../../api/clienteApi';
import Tarjeta from '../comunes/Tarjeta';
import Cargador from '../comunes/Cargador';
import MensajeAlerta from '../comunes/MensajeAlerta';

function PaginaPagos() {
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { cargarPagos(); }, []);

  const cargarPagos = async () => {
    try { const r = await obtenerPagosUsuario(1); setPagos(r.datos); }
    catch { setError('Error al cargar pagos'); }
    finally { setCargando(false); }
  };

  if (cargando) return <Cargador />;
  if (error) return <MensajeAlerta tipo="error" mensaje={error} />;

  return (
    <div className="pagina-pagos">
      <h1>Historial de pagos</h1>
      {pagos.length === 0 ? (
        <MensajeAlerta tipo="info" mensaje="No tienes pagos registrados" />
      ) : (
        <div className="pagos-lista">
          {pagos.map((p) => (
            <Tarjeta key={p.id} className="pago-tarjeta">
              <div className="pago-info">
                <div className="pago-encabezado">
                  <span className={`pago-estado pago-estado--${p.estadoPago}`}>{p.estadoPago}</span>
                  <span className="pago-monto">${p.monto.toFixed(2)}</span>
                </div>
                <p><strong>Transaccion:</strong> {p.codigoTransaccion}</p>
                <p><strong>Subasta ID:</strong> {p.subastaId}</p>
                <p><strong>Fecha:</strong> {new Date(p.fechaPago).toLocaleString()}</p>
              </div>
            </Tarjeta>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaginaPagos;
