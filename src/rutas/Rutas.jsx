import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useUsuario } from '../contextos/ContextoUsuario';
import { Button } from '../componentes/ui/Boton';
import { useTheme } from 'next-themes';
import MenuUsuario from '../componentes/plantillas/MenuUsuario';
import NavegacionMovil from '../componentes/plantillas/NavegacionMovil';
import PiePagina from '../componentes/plantillas/PiePagina';
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
import PaginaPerfil from '../paginas/PaginaPerfil';
import PaginaDenuncias from '../paginas/PaginaDenuncias';
import PaginaCrearDenuncia from '../paginas/PaginaCrearDenuncia';
import CampanaNotificaciones from '../componentes/notificaciones/CampanaNotificaciones';
import { Gavel, Sun, Moon, Users, Tag, AlertTriangle } from 'lucide-react';

function RutaProtegida({ children, rol }) {
  const { usuario } = useUsuario();
  if (!usuario) return <Navigate to="/login" replace />;
  if (rol && usuario.rol !== rol && usuario.rol !== 'administrador') return <Navigate to="/" replace />;
  return children;
}

function Encabezado() {
  const { usuario } = useUsuario();
  const { theme, setTheme } = useTheme();

  return (
    <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <NavegacionMovil />
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-amber-400 flex items-center justify-center">
              <Gavel className="h-4 w-4 text-white" />
            </div>
            <span className="hidden sm:inline">SubastasOnline</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {usuario?.rol !== 'administrador' && <Link to="/" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">Inicio</Link>}
            {usuario?.rol === 'comprador' && <>
              <Link to="/pagos" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">Mis Pagos</Link>
              <Link to="/mis-pagos-pendientes" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">Pendientes</Link>
              <Link to="/ganadas" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">Ganadas</Link>
            </>}
            {usuario?.rol === 'vendedor' && <>
              <Link to="/mis-subastas" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">Mis Subastas</Link>
              <Link to="/mis-ventas" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors">Ventas</Link>
            </>}
            {usuario?.rol === 'administrador' && <>
              <Link to="/admin#usuarios" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"><Users className="h-4 w-4" />Usuarios</Link>
              <Link to="/admin#categorias" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"><Tag className="h-4 w-4" />Categorías</Link>
              <Link to="/admin#subastas" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"><Gavel className="h-4 w-4" />Subastas</Link>
              <Link to="/admin#denuncias" className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"><AlertTriangle className="h-4 w-4" />Denuncias</Link>
            </>}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}>
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          {usuario ? (
            <div className="flex items-center gap-2">
              <CampanaNotificaciones />
              <MenuUsuario />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login"><Button variant="outline" size="sm">Ingresar</Button></Link>
              <Link to="/registro"><Button size="sm">Registrarse</Button></Link>
            </div>
          )}
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
        <main className="flex-1 container mx-auto px-4 py-6 md:py-8">
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
            <Route path="/perfil" element={<RutaProtegida><PaginaPerfil /></RutaProtegida>} />
            <Route path="/denuncias" element={<RutaProtegida rol="administrador"><PaginaDenuncias /></RutaProtegida>} />
            <Route path="/denunciar" element={<RutaProtegida><PaginaCrearDenuncia /></RutaProtegida>} />
          </Routes>
        </main>
        <PiePagina />
      </div>
    </Router>
  );
}
