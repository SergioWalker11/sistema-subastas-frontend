import { useState, useEffect } from 'react';
import { useUsuario } from '../contextos/ContextoUsuario';
import { obtenerVentas } from '../api/clienteApi';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Card';
import { Badge } from '../componentes/ui/Badge';

const ESTADOS_MAPA = {
  pendiente_pago: 'Pendiente de pago',
  vendida: 'Vendida',
  incumplida: 'Incumplida'
};

const ESTADO_VARIANTE = {
  pendiente_pago: 'default',
  vendida: 'secondary',
  incumplida: 'destructive'
};

function PaginaVentas() {
  const { usuario } = useUsuario();
  const [ventas, setVentas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const resp = await obtenerVentas(usuario.id);
        setVentas(resp.datos || []);
      } catch (e) {
        console.error(e);
      } finally {
        setCargando(false);
      }
    };
    if (usuario) cargar();
  }, [usuario]);

  if (cargando) return <div className="text-center py-16 text-muted-foreground">Cargando...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Mis Ventas</h1>
        <Badge variant="secondary">{ventas.length} venta{ventas.length !== 1 ? 's' : ''}</Badge>
      </div>

      {ventas.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">No tienes ventas registradas</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {ventas.map(v => (
            <Card key={v.subastaId}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{v.nombreProducto}</span>
                  <Badge variant={ESTADO_VARIANTE[v.estado] || 'outline'}>{ESTADOS_MAPA[v.estado] || v.estado}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comprador</span>
                  <span>{v.nombreGanador || 'Sin comprador'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Precio final</span>
                  <span className="font-bold">{v.precioFinal.toLocaleString('es-BO', { style: 'currency', currency: 'BOB' })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cierre</span>
                  <span>{new Date(v.fechaFin).toLocaleDateString()}</span>
                </div>
                {v.fechaPago && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pago</span>
                    <span>{new Date(v.fechaPago).toLocaleDateString()}</span>
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
