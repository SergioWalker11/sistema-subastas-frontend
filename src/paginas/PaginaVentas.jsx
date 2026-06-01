import { useState, useEffect } from 'react';
import { useUsuario } from '../contextos/ContextoUsuario';
import { obtenerVentas } from '../api/clienteApi';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Tarjeta';
import { Badge } from '../componentes/ui/Insignia';
import EstadoVacio from '../componentes/ui/EstadoVacio';
import Cargador from '../componentes/ui/Cargador';
import { ESTADO_MAPA, ESTADO_VARIANTE } from '../utilidades/constantes';
import { formatearMoneda } from '../utilidades/formatearMoneda';
import { ShoppingBag } from 'lucide-react';

function PaginaVentas() {
  const { usuario } = useUsuario();
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const resp = await obtenerVentas(usuario.id);
        setVentas(resp.datos || []);
      } catch { }
      finally { setCargando(false); }
    };
    if (usuario) cargar();
  }, [usuario]);

  if (cargando) return <Cargador />;

  const totalVendido = ventas.filter(v => v.estado === 'vendida').reduce((sum, v) => sum + (v.precioFinal || 0), 0);

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mis Ventas</h1>
          <p className="text-sm text-muted-foreground mt-1">Historial de ventas realizadas</p>
        </div>
        <div className="flex items-center gap-3">
          {totalVendido > 0 && <Badge variant="success" className="text-sm">{formatearMoneda(totalVendido)}</Badge>}
          <Badge variant="secondary">{ventas.length} venta{ventas.length !== 1 ? 's' : ''}</Badge>
        </div>
      </div>

      {ventas.length === 0 ? (
        <EstadoVacio mensaje="No tienes ventas registradas" icono={<ShoppingBag className="h-12 w-12 text-muted-foreground/40" />} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ventas.map((v, i) => (
            <Card key={v.subastaId} className="card-enter" style={{ animationDelay: `${i * 75}ms` }}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-2">
                  <span className="truncate">{v.nombreProducto}</span>
                  <Badge variant={ESTADO_VARIANTE[v.estado] || 'outline'} className="shrink-0">{ESTADO_MAPA[v.estado] || v.estado}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comprador</span>
                  <span>{v.nombreGanador || 'Sin comprador'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio final</span>
                  <span className="font-bold text-primary">{formatearMoneda(v.precioFinal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cierre</span>
                  <span>{new Date(v.fechaFin).toLocaleDateString()}</span>
                </div>
                {v.fechaPago && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pago recibido</span>
                    <span className="text-success">{new Date(v.fechaPago).toLocaleDateString()}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaginaVentas;
