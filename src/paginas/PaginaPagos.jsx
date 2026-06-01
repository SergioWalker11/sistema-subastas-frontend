import { useState, useEffect } from 'react';
import { obtenerPagosUsuario } from '../api/clienteApi';
import { useUsuario } from '../contextos/ContextoUsuario';
import { Card, CardContent } from '../componentes/ui/Tarjeta';
import { Badge } from '../componentes/ui/Insignia';
import EstadoVacio from '../componentes/ui/EstadoVacio';
import { Esqueleto } from '../componentes/ui/Esqueleto';
import { formatearMoneda } from '../utilidades/formatearMoneda';
import { Receipt } from 'lucide-react';

function PaginaPagos() {
  const { usuario } = useUsuario();
  const [pagos, setPagos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => { if (usuario) cargar(); }, [usuario?.id]);

  const cargar = async () => {
    try { const r = await obtenerPagosUsuario(usuario.id); setPagos(r.datos || []); }
    catch { }
    finally { setCargando(false); }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 page-enter">
      <div>
        <h1 className="text-2xl font-bold">Historial de pagos</h1>
        <p className="text-sm text-muted-foreground mt-1">Revisa todas tus transacciones</p>
      </div>

      {cargando ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <Esqueleto key={i} className="h-20 w-full rounded-xl" />)}
        </div>
      ) : pagos.length === 0 ? (
        <EstadoVacio mensaje="No tienes pagos registrados" icono={<Receipt className="h-12 w-12 text-muted-foreground/40" />} />
      ) : (
        <div className="space-y-3">
          {pagos.map(p => (
            <Card key={p.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">Subasta #{p.subastaId}</p>
                    <p className="text-xs text-muted-foreground">Transaccion: {p.codigoTransaccion}</p>
                    <p className="text-xs text-muted-foreground">{new Date(p.fechaPago).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={p.estadoPago === 'aprobado' ? 'success' : 'secondary'}>{p.estadoPago}</Badge>
                    <p className="font-bold text-lg mt-1 text-primary">{formatearMoneda(p.monto)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaginaPagos;
