import { useState } from 'react';
import { procesarPago } from '../../api/clienteApi';
import Boton from '../comunes/Boton';
import CampoFormulario from '../comunes/CampoFormulario';
import Modal from '../comunes/Modal';
import MensajeAlerta from '../comunes/MensajeAlerta';

function ModalPago({ abierto, cerrarModal, subastaId, monto, onSuccess }) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setExito('');
    setCargando(true);
    try {
      const r = await procesarPago({ subastaId, usuarioId: 1, monto });
      setExito(r.mensaje);
      if (onSuccess) onSuccess(r.datos);
      setTimeout(() => { cerrarModal(); setExito(''); }, 2000);
    } catch (err) { setError(err.response?.data?.mensaje || 'Error al procesar'); }
    finally { setCargando(false); }
  };

  return (
    <Modal abierto={abierto} cerrarModal={cerrarModal} titulo="Procesar pago">
      <form onSubmit={handleSubmit} className="formulario-pago">
        {error && <MensajeAlerta tipo="error" mensaje={error} cerrar={() => setError('')} />}
        {exito && <MensajeAlerta tipo="exito" mensaje={exito} />}
        <div className="pago-resumen">
          <p><strong>Subasta ID:</strong> {subastaId}</p>
          <p><strong>Monto:</strong> ${monto?.toFixed(2)}</p>
        </div>
        <CampoFormulario etiqueta="Nombre del titular" valor="Usuario Demo" nombre="titular" onChange={() => {}} requerido />
        <CampoFormulario etiqueta="Correo" tipo="email" valor="usuario@demo.com" nombre="correo" onChange={() => {}} requerido />
        <div className="pago-botones">
          <Boton tipo="secundario" tamano="medio" onClick={cerrarModal}>Cancelar</Boton>
          <Boton tipo="exito" tamano="medio" tipoBoton="submit" deshabilitado={cargando}>{cargando ? 'Procesando...' : 'Confirmar pago'}</Boton>
        </div>
      </form>
    </Modal>
  );
}

export default ModalPago;
