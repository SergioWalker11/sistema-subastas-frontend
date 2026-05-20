function Boton({ tipo = 'primario', tamano = 'medio', onClick, children, deshabilitado = false, tipoBoton = 'button' }) {
  const clases = `boton boton--${tipo} boton--${tamano} ${deshabilitado ? 'boton--deshabilitado' : ''}`;

  return (
    <button
      className={clases}
      onClick={onClick}
      disabled={deshabilitado}
      type={tipoBoton}
    >
      {children}
    </button>
  );
}

export default Boton;
