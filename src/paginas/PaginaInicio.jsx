import ListaSubastas from '../componentes/subastas/ListaSubastas';

function PaginaInicio() {
  return (
    <div className="pagina-inicio">
      <header className="inicio-encabezado">
        <h1>Sistema de Subastas en Linea</h1>
        <p>Encuentra las mejores ofertas y realiza pujas en tiempo real</p>
      </header>
      <ListaSubastas />
    </div>
  );
}

export default PaginaInicio;
