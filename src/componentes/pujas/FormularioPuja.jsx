import { useState } from 'react';
import { registrarPuja } from '../../api/clienteApi';
import Boton from '../comunes/Boton';
import CampoFormulario from '../comunes/CampoFormulario';
import MensajeAlerta from '../comunes/MensajeAlerta';

function FormularioPuja({ subastaId, precioActual, onSuccess }) {
  const [monto, setMonto] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const montoMinimo = (precioActual + 1).toFixed(2);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setExito('');
    if (parseFloat(monto) < parseFloat(montoMinimo)) { setError(`Monto minimo $${montoMinimo}`); return; }
    setCargando(true);
    try {
      await registrarPuja({ subastaId, usuarioId: 1, monto: parseFloat(monto) });
      setExito('Puja registrada exitosamente'); setMonto('');
      if (onSuccess) onSuccess();
    } catch (err) { setError(err.response?.data?.mensaje || 'Error al registrar'); }
    finally { setCargando(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-puja">
      {error && <MensajeAlerta tipo="error" mensaje={error} cerrar={() => setError('')} />}
      {exito && <MensajeAlerta tipo="exito" mensaje={exito} cerrar={() => setExito('')} />}
      <CampoFormulario etiqueta="Monto de la puja" tipo="number" valor={monto} onChange={(e) => setMonto(e.target.value)} nombre="monto" placeholder={`Minimo $${montoMinimo}`} requerido />
      <Boton tipo="exito" tamano="medio" tipoBoton="submit" deshabilitado={cargando}>{cargando ? 'Registrando...' : 'Realizar puja'}</Boton>
    </form>
  );
}

export default FormularioPuja;
