function MensajeAlerta({ tipo = 'info', mensaje, cerrar }) {
  return (
    <div className={`mensaje-alerta mensaje-alerta--${tipo}`}>
      <span className="mensaje-alerta-texto">{mensaje}</span>
      {cerrar && (
        <button className="mensaje-alerta-cerrar" onClick={cerrar}>&times;</button>
      )}
    </div>
  );
}

export default MensajeAlerta;
