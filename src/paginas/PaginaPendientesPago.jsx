import { useState, useEffect } from 'react';
import { useUsuario } from '../contextos/ContextoUsuario';
import { obtenerPendientesPago, procesarPago } from '../api/clienteApi';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Card';
import { Button } from '../componentes/ui/Button';
import { Badge } from '../componentes/ui/Badge';
import { Clock, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

function TiempoRestante({ fechaLimite }) {
  const [ahora, setAhora] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const restante = new Date(fechaLimite).getTime() - ahora;
  if (restante <= 0) return <Badge variant="destructive">Vencido</Badge>;

  const horas = Math.floor(restante / 3600000);
  const minutos = Math.floor((restante % 3600000) / 60000);
  return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />{horas}h {minutos}m</Badge>;
}

function PaginaPendientesPago() {
  const { usuario } = useUsuario();
  const [pendientes, setPendientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [pagandoId, setPagandoId] = useState(null);

  const cargar = async () => {
    try {
      setCargando(true);
      const resp = await obtenerPendientesPago(usuario.id);
      setPendientes(resp.datos || []);
    } catch (e) {
      setError('Error al cargar pendientes de pago');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { if (usuario) cargar(); }, [usuario]);

  const pagar = async (subasta) => {
    try {
      setPagandoId(subasta.id);
      await procesarPago({ subastaId: subasta.id, usuarioId: usuario.id, monto: subasta.montoGanado });
      setPagandoId(null);
      cargar();
    } catch (e) {
      setError(e.response?.data?.mensaje || 'Error al procesar el pago');
      setPagandoId(null);
    }
  };

  if (cargando) return <div className="text-center py-16 text-muted-foreground">Cargando...</div>;
  if (error) return <div className="text-destructive p-4">{error}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pagos Pendientes</h1>
        <Badge variant="secondary">{pendientes.length} pendiente{pendientes.length !== 1 ? 's' : ''}</Badge>
      </div>

      {pendientes.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">No tienes pagos pendientes</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {pendientes.map(p => (
            <Card key={p.id}>
              <CardHeader>
                <CardTitle className="flex items-start justify-between">
                  <span>{p.nombreProducto}</span>
                  <TiempoRestante fechaLimite={p.fechaLimitePago} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Monto a pagar</span>
                  <span className="font-bold text-lg">{p.montoGanado.toLocaleString('es-BO', { style: 'currency', currency: 'BOB' })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Vendedor</span>
                  <span>{p.nombreVendedor}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Límite de pago</span>
                  <span>{new Date(p.fechaLimitePago).toLocaleString()}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Link to={`/subasta/${p.id}`} className="flex-1"><Button variant="outline" className="w-full">Ver detalle</Button></Link>
                  <Button className="flex-1" onClick={() => pagar(p)} disabled={pagandoId === p.id}>
                    {pagandoId === p.id ? 'Procesando...' : <><DollarSign className="h-4 w-4 mr-1" />Pagar ahora</>}
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
