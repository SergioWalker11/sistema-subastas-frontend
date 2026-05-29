import ListaSubastas from '../componentes/subastas/ListaSubastas';

function PaginaInicio() {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-primary to-blue-700 text-primary-foreground rounded-lg p-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Sistema de Subastas en Línea</h1>
        <p className="text-primary-foreground/80">Encuentra las mejores ofertas y realiza pujas en tiempo real</p>
      </div>
      <ListaSubastas />
    </div>
  );
}

export default PaginaInicio;
