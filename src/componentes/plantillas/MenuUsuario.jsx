import { Link } from 'react-router-dom';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from '../ui/MenuDesplegable';
import { Avatar, AvatarFallback } from '../ui/AvatarUI';
import { Badge } from '../ui/Insignia';
import { useUsuario } from '../../contextos/ContextoUsuario';
import { Package, ShoppingBag, Gavel, DollarSign, Clock, LogOut, User, Users, Tag, AlertTriangle } from 'lucide-react';

export default function MenuUsuario() {
  const { usuario, cerrarSesion } = useUsuario();
  const iniciales = usuario?.nombre?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || '?';
  const rol = usuario?.rol;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 outline-none">
          <Avatar className="h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
            <AvatarFallback className="text-xs">{iniciales}</AvatarFallback>
          </Avatar>
          <span className="hidden sm:inline text-sm font-medium">{usuario?.nombre?.split(' ')[0]}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium">{usuario?.nombre}</p>
            <p className="text-xs text-muted-foreground">{usuario?.correo}</p>
            <Badge variant="outline" className="w-fit mt-1 text-[10px]">{rol}</Badge>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild><Link to="/perfil" className="cursor-pointer w-full"><User className="h-4 w-4 mr-2" />Perfil</Link></DropdownMenuItem>
        {rol === 'comprador' && (
          <>
            <DropdownMenuItem asChild><Link to="/pagos" className="cursor-pointer w-full"><DollarSign className="h-4 w-4 mr-2" />Mis Pagos</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/mis-pagos-pendientes" className="cursor-pointer w-full"><Clock className="h-4 w-4 mr-2" />Pendientes</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/ganadas" className="cursor-pointer w-full"><Gavel className="h-4 w-4 mr-2" />Ganadas</Link></DropdownMenuItem>
          </>
        )}
        {rol === 'vendedor' && (
          <>
            <DropdownMenuItem asChild><Link to="/mis-subastas" className="cursor-pointer w-full"><Package className="h-4 w-4 mr-2" />Mis Subastas</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/mis-ventas" className="cursor-pointer w-full"><ShoppingBag className="h-4 w-4 mr-2" />Ventas</Link></DropdownMenuItem>
          </>
        )}
        {rol === 'administrador' && (
          <>
            <DropdownMenuItem asChild><Link to="/admin#usuarios" className="cursor-pointer w-full"><Users className="h-4 w-4 mr-2" />Usuarios</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/admin#categorias" className="cursor-pointer w-full"><Tag className="h-4 w-4 mr-2" />Categorías</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/admin#subastas" className="cursor-pointer w-full"><Gavel className="h-4 w-4 mr-2" />Subastas</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/admin#denuncias" className="cursor-pointer w-full"><AlertTriangle className="h-4 w-4 mr-2" />Denuncias</Link></DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={cerrarSesion} className="text-destructive cursor-pointer">
          <LogOut className="h-4 w-4 mr-2" />Cerrar sesion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
