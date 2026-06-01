import { Link } from 'react-router-dom';
import { Gavel } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg mb-2">
              <Gavel className="h-5 w-5 text-primary" /> SubastasOnline
            </Link>
            <p className="text-sm text-muted-foreground">La plataforma lider de subastas en linea en Bolivia.</p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Enlaces</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/" className="hover:text-foreground transition-colors">Inicio</Link></li>
              <li><Link to="/login" className="hover:text-foreground transition-colors">Iniciar Sesion</Link></li>
              <li><Link to="/registro" className="hover:text-foreground transition-colors">Registrarse</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><span>Terminos y Condiciones</span></li>
              <li><span>Politica de Privacidad</span></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>soporte@subastasonline.bo</li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} SubastasOnline. Proyecto Universitario — Ingenieria de Software II
        </div>
      </div>
    </footer>
  );
}
