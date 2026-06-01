import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUsuario } from '../contextos/ContextoUsuario';
import { obtenerSubastasVendedor } from '../api/clienteApi';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Tarjeta';
import { Button } from '../componentes/ui/Boton';
import { Badge } from '../componentes/ui/Insignia';
import EstadoVacio from '../componentes/ui/EstadoVacio';
import { EsqueletoGrilla } from '../componentes/ui/Esqueleto';
import { ESTADO_MAPA, ESTADO_VARIANTE } from '../utilidades/constantes';
import { formatearMoneda } from '../utilidades/formatearMoneda';
import { Plus, PackageOpen } from 'lucide-react';

function PaginaMisSubastas() {
  const { usuario } = useUsuario();
  const [subastas, setSubastas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (usuario) {
      obtenerSubastasVendedor(usuario.id)
        .then(r => setSubastas(r.datos || []))
        .catch(() => { })
        .finally(() => setCargando(false));
    }
  }, [usuario?.id]);

  return (
    <div className="max-w-4xl mx-auto space-y-6 page-enter">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Mis subastas</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestiona las subastas que has creado</p>
        </div>
        <Link to="/crear-producto"><Button><Plus className="h-4 w-4 mr-1" /> Nueva subasta</Button></Link>
      </div>

      {cargando ? (
        <EsqueletoGrilla count={4} />
      ) : subastas.length === 0 ? (
        <EstadoVacio
          mensaje="No has creado ninguna subasta aun."
          icono={<PackageOpen className="h-12 w-12 text-muted-foreground/40" />}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {subastas.map((s, i) => (
            <Card key={s.id} className="card-enter" style={{ animationDelay: `${i * 75}ms` }}>
              <CardHeader>
                <div className="flex justify-between items-start gap-2">
                  <CardTitle className="text-lg truncate">{s.nombreProducto}</CardTitle>
                  <Badge variant={ESTADO_VARIANTE[s.estado] || 'outline'} className="shrink-0">{ESTADO_MAPA[s.estado] || s.estado}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                  <p className="text-muted-foreground">Inicial: <span className="font-medium text-foreground">{formatearMoneda(s.precioInicial)}</span></p>
                  <p className="text-muted-foreground">Actual: <span className="font-medium text-primary">{formatearMoneda(s.precioActual)}</span></p>
                  <p className="text-muted-foreground">Pujas: <span className="font-medium text-foreground">{s.cantidadPujas}</span></p>
                  <p className="text-muted-foreground">Fin: <span className="font-medium text-foreground">{new Date(s.fechaFin).toLocaleDateString()}</span></p>
                </div>
                {s.nombreGanador && <p className="text-sm text-muted-foreground mb-3">Ganador: {s.nombreGanador}</p>}
                <Link to={`/subasta/${s.id}`}><Button variant="outline" size="sm" className="w-full">Ver detalle</Button></Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaginaMisSubastas;
