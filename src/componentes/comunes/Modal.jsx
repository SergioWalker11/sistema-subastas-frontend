function Modal({ abierto, cerrarModal, titulo, children }) {
  if (!abierto) return null;

  return (
    <div className="modal-superposicion" onClick={cerrarModal}>
      <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
        <div className="modal-encabezado">
          <h2 className="modal-titulo">{titulo}</h2>
          <button className="modal-cerrar" onClick={cerrarModal}>&times;</button>
        </div>
        <div className="modal-cuerpo">{children}</div>
      </div>
    </div>
  );
}

export default Modal;
