import { useState } from 'react';
import { crearSubasta } from '../../api/clienteApi';
import { useUsuario } from '../../contextos/ContextoUsuario';
import Boton from '../comunes/Boton';
import CampoFormulario from '../comunes/CampoFormulario';
import Tarjeta from '../comunes/Tarjeta';
import MensajeAlerta from '../comunes/MensajeAlerta';

function FormularioCrearSubasta({ onSuccess }) {
  const { usuario } = useUsuario();
  const [productoId, setProductoId] = useState('');
  const [precioInicial, setPrecioInicial] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setExito('');
    if (!productoId || !precioInicial || !fechaInicio || !fechaFin) {
      setError('Todos los campos son requeridos');
      return;
    }
    setCargando(true);
    try {
      const r = await crearSubasta({
        productoId: parseInt(productoId),
        vendedorId: usuario.id,
        precioInicial: parseFloat(precioInicial),
        fechaInicio: new Date(fechaInicio).toISOString(),
        fechaFin: new Date(fechaFin).toISOString()
      });
      setExito(r.mensaje || 'Subasta creada exitosamente');
      setProductoId(''); setPrecioInicial(''); setFechaInicio(''); setFechaFin('');
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear subasta');
    } finally {
      setCargando(false);
    }
  };

  if (!usuario || usuario.rol !== 'vendedor') return null;

  return (
    <Tarjeta className="formulario-crear-subasta">
      <h2>Crear nueva subasta</h2>
      <form onSubmit={handleSubmit}>
        {error && <MensajeAlerta tipo="error" mensaje={error} cerrar={() => setError('')} />}
        {exito && <MensajeAlerta tipo="exito" mensaje={exito} cerrar={() => setExito('')} />}
        <CampoFormulario etiqueta="ID del producto" tipo="number" valor={productoId} onChange={(e) => setProductoId(e.target.value)} nombre="productoId" placeholder="ID del producto existente" requerido />
        <CampoFormulario etiqueta="Precio inicial (Bs)" tipo="number" valor={precioInicial} onChange={(e) => setPrecioInicial(e.target.value)} nombre="precioInicial" placeholder="Ej: 500.00" requerido />
        <CampoFormulario etiqueta="Fecha inicio" tipo="datetime-local" valor={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} nombre="fechaInicio" requerido />
        <CampoFormulario etiqueta="Fecha fin" tipo="datetime-local" valor={fechaFin} onChange={(e) => setFechaFin(e.target.value)} nombre="fechaFin" requerido />
        <div className="formulario-ayuda">
          <p>La subasta se creara en estado "activa" y aparecera inmediatamente en el listado.</p>
        </div>
        <Boton tipo="primario" tamano="medio" tipoBoton="submit" deshabilitado={cargando}>
          {cargando ? 'Creando...' : 'Crear subasta'}
        </Boton>
      </form>
    </Tarjeta>
  );
}

export default FormularioCrearSubasta;
