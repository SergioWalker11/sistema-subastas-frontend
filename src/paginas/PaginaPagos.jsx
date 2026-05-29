import { useState, useEffect } from 'react';
import { obtenerPagosUsuario } from '../api/clienteApi';
import { useUsuario } from '../contextos/ContextoUsuario';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Card';
import { Badge } from '../componentes/ui/Badge';

function PaginaPagos() {
  const { usuario } = useUsuario();
  const [pagos, setPagos] = useState([]);

  useEffect(() => { if (usuario) cargar(); }, [usuario?.id]);

  const cargar = async () => {
    try { const r = await obtenerPagosUsuario(usuario.id); setPagos(r.datos || []); }
    catch { }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Historial de pagos</h1>
      {pagos.length === 0 ? (
        <p className="text-muted-foreground">No tienes pagos registrados</p>
      ) : (
        pagos.map(p => (
          <Card key={p.id}>
            <CardContent className="p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">Subasta #{p.subastaId}</p>
                  <p className="text-xs text-muted-foreground">Transacción: {p.codigoTransaccion}</p>
                  <p className="text-xs text-muted-foreground">{new Date(p.fechaPago).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <Badge variant={p.estadoPago === 'aprobado' ? 'success' : 'secondary'}>{p.estadoPago}</Badge>
                  <p className="font-bold text-lg mt-1">Bs {p.monto.toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default PaginaPagos;
