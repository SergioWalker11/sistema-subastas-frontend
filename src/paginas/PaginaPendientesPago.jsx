import { useState, useEffect, useCallback } from 'react';
import { useUsuario } from '../contextos/ContextoUsuario';
import { obtenerPendientesPago } from '../api/clienteApi';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Tarjeta';
import { Button } from '../componentes/ui/Boton';
import { Badge } from '../componentes/ui/Insignia';
import EstadoVacio from '../componentes/ui/EstadoVacio';
import Cargador from '../componentes/ui/Cargador';
import CuentaRegresiva from '../componentes/ui/CuentaRegresiva';
import { formatearMoneda } from '../utilidades/formatearMoneda';
import { Clock, DollarSign, Mail } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

function PaginaPendientesPago() {
  const { usuario } = useUsuario();
  const navigate = useNavigate();
  const [pendientes, setPendientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    try {
      setCargando(true);
      const resp = await obtenerPendientesPago(usuario.id);
      setPendientes(resp.datos || []);
    } catch { setError('Error al cargar pendientes de pago'); }
    finally { setCargando(false); }
  }, [usuario]);

  useEffect(() => { if (usuario) cargar(); }, [usuario, cargar]);

  if (cargando) return <Cargador />;
  if (error) return <div className="text-destructive p-4">{error}</div>;

  return (
    <div className="space-y-6 page-enter">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pagos Pendientes</h1>
          <p className="text-sm text-muted-foreground mt-1">Subastas que has ganado y requieren pago</p>
        </div>
        <Badge variant={pendientes.length > 3 ? 'warning' : 'secondary'}>{pendientes.length} pendiente{pendientes.length !== 1 ? 's' : ''}</Badge>
      </div>

      {pendientes.length === 0 ? (
        <EstadoVacio mensaje="No tienes pagos pendientes" icono={<Clock className="h-12 w-12 text-muted-foreground/40" />} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {pendientes.map(p => (
            <Card key={p.id} className="card-enter">
              <CardHeader>
                <CardTitle className="flex items-start justify-between gap-2">
                  <span className="truncate">{p.nombreProducto}</span>
                  <CuentaRegresiva endsAt={p.fechaLimitePago} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monto a pagar</span>
                  <span className="font-bold text-lg text-primary">{formatearMoneda(p.montoGanado)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vendedor</span>
                  <span className="text-right">{p.nombreVendedor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Correo vendedor</span>
                  <span className="text-right text-xs flex items-center gap-1"><Mail className="h-3 w-3" />{p.correoVendedor || 'No disponible'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Límite de pago</span>
                  <span>{new Date(p.fechaLimitePago).toLocaleString()}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link to={`/subasta/${p.id}`} className="flex-1"><Button variant="outline" className="w-full">Ver detalle</Button></Link>
                  <Button className="flex-1" onClick={() => navigate(`/subasta/${p.id}`)}>
                    <DollarSign className="h-4 w-4 mr-1" />Pagar ahora
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaginaPendientesPago;
