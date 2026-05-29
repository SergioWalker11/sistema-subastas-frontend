import { useRef } from 'react';
import { useTeclaEscape } from '../../hooks/useInteraccion';

function Modal({ abierto, cerrarModal, titulo, children }) {
  const ref = useRef(null);
  useTeclaEscape(() => { if (abierto) cerrarModal(); });

  if (!abierto) return null;

  return (
    <div className="modal-superposicion" onClick={cerrarModal}>
      <div className="modal-contenido" ref={ref} onClick={(e) => e.stopPropagation()}>
        <div className="modal-encabezado">
          <h2 className="modal-titulo">{titulo}</h2>
          <button className="modal-cerrar" onClick={cerrarModal} aria-label="Cerrar modal">&times;</button>
        </div>
        <div className="modal-cuerpo">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
