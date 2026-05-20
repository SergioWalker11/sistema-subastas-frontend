import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerDetalleSubasta } from '../../api/clienteApi';
import Tarjeta from '../comunes/Tarjeta';
import Boton from '../comunes/Boton';
import Cargador from '../comunes/Cargador';
import MensajeAlerta from '../comunes/MensajeAlerta';
import FormularioPuja from '../pujas/FormularioPuja';
import HistorialPujas from '../pujas/HistorialPujas';

function DetalleSubasta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [subasta, setSubasta] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => { cargarDetalle(); }, [id]);

  const cargarDetalle = async () => {
    try {
      const respuesta = await obtenerDetalleSubasta(id);
      setSubasta(respuesta.datos);
    } catch { setError('Error al cargar el detalle'); }
    finally { setCargando(false); }
  };

  if (cargando) return <Cargador />;
  if (error) return <MensajeAlerta tipo="error" mensaje={error} />;
  if (!subasta) return <MensajeAlerta tipo="info" mensaje="Subasta no encontrada" />;

  return (
    <div className="detalle-subasta">
      <Boton tipo="secundario" tamano="pequeno" onClick={() => navigate('/')}>Volver</Boton>
      <Tarjeta className="detalle-subasta-info">
        <h1>{subasta.nombreProducto}</h1>
        <p>{subasta.descripcionProducto}</p>
        <div className="detalle-subasta-precios">
          <div><span>Precio inicial</span><strong>${subasta.precioInicial.toFixed(2)}</strong></div>
          <div><span>Precio actual</span><strong className="precio-actual">${subasta.precioActual.toFixed(2)}</strong></div>
        </div>
        <div className="detalle-subasta-meta">
          <span className={`estado estado--${subasta.estado}`}>{subasta.estado}</span>
          <span>{subasta.cantidadPujas} pujas</span>
        </div>
        <div className="detalle-subasta-fechas">
          <p><strong>Inicio:</strong> {new Date(subasta.fechaInicio).toLocaleString()}</p>
          <p><strong>Fin:</strong> {new Date(subasta.fechaFin).toLocaleString()}</p>
        </div>
      </Tarjeta>
      {subasta.estado === 'activa' && (
        <Tarjeta className="detalle-subasta-puja">
          <h2>Realizar puja</h2>
          <FormularioPuja subastaId={subasta.id} precioActual={subasta.precioActual} onSuccess={cargarDetalle} />
        </Tarjeta>
      )}
      <Tarjeta className="detalle-subasta-historial">
        <h2>Historial de pujas</h2>
        <HistorialPujas subastaId={subasta.id} />
      </Tarjeta>
    </div>
  );
}

export default DetalleSubasta;
