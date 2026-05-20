import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import PaginaInicio from '../paginas/PaginaInicio';
import PaginaDetalleSubasta from '../paginas/PaginaDetalleSubasta';
import PaginaPagosUsuario from '../paginas/PaginaPagosUsuario';
import CampanaNotificaciones from '../componentes/notificaciones/CampanaNotificaciones';

function Encabezado() {
  return (
    <header className="encabezado">
      <div className="encabezado-contenido">
        <Link to="/" className="encabezado-logo">SubastasOnline</Link>
        <nav className="encabezado-navegacion">
          <Link to="/">Subastas</Link>
          <Link to="/pagos">Mis Pagos</Link>
        </nav>
        <div className="encabezado-acciones"><CampanaNotificaciones /></div>
      </div>
    </header>
  );
}

function Rutas() {
  return (
    <Router>
      <div className="aplicacion">
        <Encabezado />
        <main className="contenido-principal">
          <Routes>
            <Route path="/" element={<PaginaInicio />} />
            <Route path="/subasta/:id" element={<PaginaDetalleSubasta />} />
            <Route path="/pagos" element={<PaginaPagosUsuario />} />
          </Routes>
        </main>
        <footer className="pie-pagina"><p>Sistema de Subastas en Linea - Proyecto Universitario</p></footer>
      </div>
    </Router>
  );
}

export default Rutas;
