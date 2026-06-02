import { Link } from 'react-router-dom';
import ListaSubastas from '../componentes/listas/ListaSubastas';
import { Button } from '../componentes/ui/Boton';
import { useUsuario } from '../contextos/ContextoUsuario';
import { Gavel, Search } from 'lucide-react';

function PaginaInicio() {
  const { usuario } = useUsuario();

  return (
    <div className="space-y-8 page-enter">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-700 via-blue-500 to-cyan-400 dark:from-blue-950/60 dark:via-blue-900/40 dark:to-cyan-950/30">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-8 left-10 w-20 h-20 rounded-xl bg-white/20 rotate-12 animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute top-20 right-16 w-14 h-14 rounded-xl bg-white/15 -rotate-6 animate-float" style={{ animationDelay: '0.4s' }} />
          <div className="absolute bottom-10 left-[30%] w-16 h-16 rounded-xl bg-white/25 rotate-6 animate-float" style={{ animationDelay: '0.8s' }} />
          <div className="absolute top-32 right-[40%] w-10 h-10 rounded-full bg-white/20 animate-float" style={{ animationDelay: '1.2s' }} />
          <div className="absolute bottom-14 right-12 w-12 h-12 rounded-lg bg-white/20 -rotate-12 animate-float" style={{ animationDelay: '1.6s' }} />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 p-8 md:p-12">
          <div className="flex-1 text-center md:text-left text-white">
            <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-medium mb-4 backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-amber-300 animate-pulse" />
              Subastas en vivo
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight drop-shadow-md mb-4">
              Encuentra Tesoros <br /><span className="text-amber-300 drop-shadow-md">Únicos</span>
            </h1>
            <p className="text-white/80 text-lg mb-6 max-w-md">
              La plataforma lider de subastas en linea en Bolivia. Descubre productos exclusivos y gana con la mejor oferta.
            </p>
            {!usuario && (
              <div className="flex gap-3 justify-center md:justify-start">
                <Link to="/registro"><Button size="lg" variant="secondary" className="shadow-lg">Comenzar ahora</Button></Link>
                <Link to="/login"><Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">Iniciar Sesion</Button></Link>
              </div>
            )}
          </div>
          <div className="flex-1 flex justify-center items-center">
            <div className="relative">
              <div className="w-48 h-48 md:w-64 md:h-64 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                <Gavel className="h-24 w-24 md:h-32 md:w-32 text-white drop-shadow-xl" style={{ transform: 'rotate(-15deg)' }} />
              </div>
              <div className="absolute -top-4 -right-4 bg-white text-foreground rounded-xl px-3 py-2 shadow-lg animate-float" style={{ animationDelay: '0.3s' }}>
                <p className="text-xs font-medium">Pujas en vivo</p>
                <p className="text-lg font-bold text-primary">100% seguro</p>
              </div>
              <div className="absolute -bottom-2 -left-2 bg-white text-foreground rounded-xl px-3 py-2 shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                <p className="text-xs font-medium">Sin comisiones</p>
                <p className="text-lg font-bold text-secondary">Transparente</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Search className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-xl font-bold">Explorar subastas</h2>
      </div>
      <ListaSubastas />
    </div>
  );
}

export default PaginaInicio;
