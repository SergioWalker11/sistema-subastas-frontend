import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useUsuario } from '../contextos/ContextoUsuario';
import { Button } from '../componentes/ui/Button';
import { Badge } from '../componentes/ui/Badge';
import { Home, DollarSign, Package, Shield, Gavel, Clock, ShoppingBag } from 'lucide-react';
import PaginaInicio from '../paginas/PaginaInicio';
import PaginaDetalleSubasta from '../paginas/PaginaDetalleSubasta';
import PaginaPagos from '../paginas/PaginaPagos';
import PaginaLogin from '../paginas/PaginaLogin';
import PaginaRegistro from '../paginas/PaginaRegistro';
import PaginaMisSubastas from '../paginas/PaginaMisSubastas';
import PaginaGanadas from '../paginas/PaginaGanadas';
import PaginaAdmin from '../paginas/PaginaAdmin';
import PaginaCrearProducto from '../paginas/PaginaCrearProducto';
import PaginaPendientesPago from '../paginas/PaginaPendientesPago';
import PaginaVentas from '../paginas/PaginaVentas';
import CampanaNotificaciones from '../componentes/notificaciones/CampanaNotificaciones';

function RutaProtegida({ children, rol }) {
  const { usuario } = useUsuario();
  if (!usuario) return <Navigate to="/login" replace />;
  if (rol && usuario.rol !== rol && usuario.rol !== 'administrador') return <Navigate to="/" replace />;
  return children;
}

function Encabezado() {
  const { usuario, cerrarSesion } = useUsuario();
  return (
    <header className="border-b bg-background sticky top-0 z-40">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg"><Gavel className="h-5 w-5 text-primary" />SubastasOnline</Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"><Home className="h-4 w-4" />Inicio</Link>
            {usuario && <Link to="/pagos" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"><DollarSign className="h-4 w-4" />Mis Pagos</Link>}
            {usuario && <Link to="/mis-pagos-pendientes" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"><Clock className="h-4 w-4" />Pendientes</Link>}
            {(usuario?.rol === 'vendedor' || usuario?.rol === 'administrador') && <Link to="/mis-subastas" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"><Package className="h-4 w-4" />Mis Subastas</Link>}
            {(usuario?.rol === 'vendedor' || usuario?.rol === 'administrador') && <Link to="/mis-ventas" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"><ShoppingBag className="h-4 w-4" />Ventas</Link>}
            {usuario && <Link to="/ganadas" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"><Gavel className="h-4 w-4" />Ganadas</Link>}
            {usuario?.rol === 'administrador' && <Link to="/admin" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent transition-colors"><Shield className="h-4 w-4" />Admin</Link>}
          </nav>
        </div>
        <div className="flex items-center gap-3">
          {usuario ? (<><CampanaNotificaciones /><span className="hidden sm:inline text-sm">{usuario.nombre} <Badge variant="outline" className="ml-1">{usuario.rol}</Badge></span><Button variant="ghost" size="sm" onClick={cerrarSesion}>Salir</Button></>) : (<><Link to="/login"><Button variant="ghost" size="sm">Ingresar</Button></Link><Link to="/registro"><Button size="sm">Registrarse</Button></Link></>)}
        </div>
      </div>
    </header>
  );
}

export default function Rutas() {
  return (
    <Router>
      <div className="min-h-screen bg-background flex flex-col">
        <Encabezado />
        <main className="flex-1 container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<PaginaInicio />} />
            <Route path="/login" element={<PaginaLogin />} />
            <Route path="/registro" element={<PaginaRegistro />} />
            <Route path="/subasta/:id" element={<PaginaDetalleSubasta />} />
            <Route path="/pagos" element={<RutaProtegida><PaginaPagos /></RutaProtegida>} />
            <Route path="/mis-pagos-pendientes" element={<RutaProtegida><PaginaPendientesPago /></RutaProtegida>} />
            <Route path="/mis-subastas" element={<RutaProtegida rol="vendedor"><PaginaMisSubastas /></RutaProtegida>} />
            <Route path="/mis-ventas" element={<RutaProtegida rol="vendedor"><PaginaVentas /></RutaProtegida>} />
            <Route path="/crear-producto" element={<RutaProtegida rol="vendedor"><PaginaCrearProducto /></RutaProtegida>} />
            <Route path="/ganadas" element={<RutaProtegida><PaginaGanadas /></RutaProtegida>} />
            <Route path="/admin" element={<RutaProtegida rol="administrador"><PaginaAdmin /></RutaProtegida>} />
          </Routes>
        </main>
        <footer className="border-t py-4 text-center text-sm text-muted-foreground">Sistema de Subastas en Línea - Proyecto Universitario</footer>
      </div>
    </Router>
  );
}
