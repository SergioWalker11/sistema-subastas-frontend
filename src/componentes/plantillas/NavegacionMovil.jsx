import { Link, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '../ui/PanelLateral';
import { Button } from '../ui/Boton';
import { useUsuario } from '../../contextos/ContextoUsuario';
import { Avatar, AvatarFallback } from '../ui/AvatarUI';
import { useTheme } from 'next-themes';
import { Menu, Home, DollarSign, Clock, Package, ShoppingBag, Gavel, Shield, LogOut, Sun, Moon, Users, Tag, AlertTriangle } from 'lucide-react';

export default function NavegacionMovil() {
  const { usuario, cerrarSesion } = useUsuario();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const rol = usuario?.rol;

  const links = [
    ...(rol !== 'administrador' ? [{ to: '/', icon: Home, label: 'Inicio' }] : []),
    ...(rol === 'comprador' ? [
      { to: '/pagos', icon: DollarSign, label: 'Mis Pagos' },
      { to: '/mis-pagos-pendientes', icon: Clock, label: 'Pendientes' },
      { to: '/ganadas', icon: Gavel, label: 'Ganadas' },
    ] : []),
    ...(rol === 'vendedor' ? [
      { to: '/mis-subastas', icon: Package, label: 'Mis Subastas' },
      { to: '/mis-ventas', icon: ShoppingBag, label: 'Ventas' },
    ] : []),
    ...(rol === 'administrador' ? [
      { to: '/admin#usuarios', icon: Users, label: 'Usuarios' },
      { to: '/admin#categorias', icon: Tag, label: 'Categorías' },
      { to: '/admin#subastas', icon: Gavel, label: 'Subastas' },
      { to: '/admin#denuncias', icon: AlertTriangle, label: 'Denuncias' },
    ] : []),
  ];

  const iniciales = usuario?.nombre?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Gavel className="h-5 w-5 text-primary" /> SubastasOnline
          </SheetTitle>
        </SheetHeader>
        <nav className="flex-1 mt-6 space-y-1">
          {links.map(l => {
            const activo = location.pathname === l.to;
            return (
              <Link key={l.to} to={l.to} className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors ${activo ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'}`}>
                <l.icon className="h-4 w-4" />
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t pt-4 mt-auto space-y-3">
          {usuario ? (
            <>
              <div className="flex items-center gap-3 px-3">
                <Avatar><AvatarFallback>{iniciales}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{usuario.nombre}</p>
                  <p className="text-xs text-muted-foreground">{usuario.correo}</p>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="w-full justify-start text-destructive" onClick={cerrarSesion}>
                <LogOut className="h-4 w-4 mr-2" /> Cerrar sesion
              </Button>
            </>
          ) : null}
          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="ml-3">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
