function Cargador({ mensaje = 'Cargando...' }) {
  return (
    <div className="cargador">
      <div className="cargador-animacion"></div>
      <p className="cargador-mensaje">{mensaje}</p>
    </div>
  );
}

export default Cargador;
