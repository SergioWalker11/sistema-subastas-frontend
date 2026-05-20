function ListaNotificaciones({ notificaciones, onMarcarLeida }) {
  if (notificaciones.length === 0) return <div className="lista-notificaciones-vacia"><p>No tienes notificaciones</p></div>;

  return (
    <div className="lista-notificaciones">
      <h3 className="lista-notificaciones-titulo">Notificaciones</h3>
      <ul className="lista-notificaciones-items">
        {notificaciones.map((n) => (
          <li key={n.id} className={`notificacion-item ${!n.leida ? 'notificacion-item--no-leida' : ''}`} onClick={() => !n.leida && onMarcarLeida(n.id)}>
            <div className="notificacion-contenido">
              <strong className="notificacion-titulo">{n.titulo}</strong>
              <p className="notificacion-mensaje">{n.mensaje}</p>
              <small className="notificacion-fecha">{new Date(n.fechaCreacion).toLocaleString()}</small>
            </div>
            {!n.leida && <span className="notificacion-indicador"></span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListaNotificaciones;
