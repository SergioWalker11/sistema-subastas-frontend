import Tarjeta from '../comunes/Tarjeta';
import Boton from '../comunes/Boton';

function TarjetaSubasta({ subasta, onClick }) {
  return (
    <Tarjeta className="tarjeta-subasta">
      <div className="tarjeta-subasta-contenido">
        <h3 className="tarjeta-subasta-nombre">{subasta.nombreProducto}</h3>
        <p className="tarjeta-subasta-descripcion">{subasta.descripcionProducto}</p>
        <div className="tarjeta-subasta-precios">
          <div className="precio-inicial"><span>Precio inicial</span><strong>${subasta.precioInicial.toFixed(2)}</strong></div>
          <div className="precio-actual"><span>Precio actual</span><strong>${subasta.precioActual.toFixed(2)}</strong></div>
        </div>
        <div className="tarjeta-subasta-info">
          <span className={`subasta-estado subasta-estado--${subasta.estado}`}>{subasta.estado}</span>
          <span className="tarjeta-subasta-pujas">{subasta.cantidadPujas} pujas</span>
        </div>
        <div className="tarjeta-subasta-fechas">
          <small>Inicio: {new Date(subasta.fechaInicio).toLocaleDateString()}</small>
          <small>Fin: {new Date(subasta.fechaFin).toLocaleDateString()}</small>
        </div>
      </div>
      <Boton tipo="primario" tamano="medio" onClick={onClick}>Ver detalle</Boton>
    </Tarjeta>
  );
}

export default TarjetaSubasta;
