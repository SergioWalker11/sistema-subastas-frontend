import { useState, useEffect } from 'react';
import { obtenerSubastasGanadas, procesarPago } from '../api/clienteApi';
import { useUsuario } from '../contextos/ContextoUsuario';
import { Card, CardContent } from '../componentes/ui/Tarjeta';
import { Badge } from '../componentes/ui/Insignia';
import { Button } from '../componentes/ui/Boton';
import Confirmacion from '../componentes/ui/Confirmacion';
import EstadoVacio from '../componentes/ui/EstadoVacio';
import Cargador from '../componentes/ui/Cargador';
import { toastExito, toastError } from '../componentes/ui/NotificacionToast';
import { ESTADO_MAPA, ESTADO_VARIANTE } from '../utilidades/constantes';
import { formatearMoneda } from '../utilidades/formatearMoneda';
import { Clock, Trophy } from 'lucide-react';

function PaginaGanadas() {
  const { usuario } = useUsuario();
  const [ganadas, setGanadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [subastaSeleccionada, setSubastaSeleccionada] = useState(null);
  const [pagando, setPagando] = useState(false);

  const cargar = async () => {
    try {
      const r = await obtenerSubastasGanadas(usuario.id);
      setGanadas(r.datos || []);
    } catch { }
    finally { setCargando(false); }
  };

  useEffect(() => { if (usuario) cargar(); }, [usuario?.id]);

  const confirmarPago = async () => {
    setDialogoAbierto(false);
    setPagando(true);
    try {
      await procesarPago({ subastaId: subastaSeleccionada.id, usuarioId: usuario.id, monto: subastaSeleccionada.montoGanado });
      toastExito('Pago procesado exitosamente');
      cargar();
    } catch { toastError('Error al procesar el pago'); }
    finally { setPagando(false); setSubastaSeleccionada(null); }
  };

  if (cargando) return <Cargador />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 page-enter">
      <div>
        <h1 className="text-2xl font-bold">Subastas ganadas</h1>
        <p className="text-sm text-muted-foreground mt-1">Subastas en las que has sido el mejor postor</p>
      </div>

      {ganadas.length === 0 ? (
        <EstadoVacio mensaje="Aun no has ganado ninguna subasta." icono={<Trophy className="h-12 w-12 text-muted-foreground/40" />} />
      ) : (
        <div className="space-y-3">
          {ganadas.map(g => (
            <Card key={g.id} className="card-enter">
              <CardContent className="p-4 flex justify-between items-center">
                <div className="min-w-0 flex-1 mr-4">
                  <p className="font-semibold">{g.nombreProducto}</p>
                  <p className="text-sm text-muted-foreground">Vendedor: {g.nombreVendedor}</p>
                  <p className="text-sm text-muted-foreground">Finalizo: {new Date(g.fechaFin).toLocaleDateString()}</p>
                  {g.fechaLimitePago && <p className="text-sm text-muted-foreground"><Clock className="h-3 w-3 inline mr-1" />Limite de pago: {new Date(g.fechaLimitePago).toLocaleString()}</p>}
                  <p className="text-lg font-bold text-primary mt-1">{formatearMoneda(g.montoGanado)}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge variant={ESTADO_VARIANTE[g.estado] || 'outline'}>{ESTADO_MAPA[g.estado] || g.estado}</Badge>
                  {!g.pagado && g.estado === 'pendiente_pago' && (
                    <Button size="sm" onClick={() => { setSubastaSeleccionada(g); setDialogoAbierto(true); }}>Pagar ahora</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Confirmacion
        open={dialogoAbierto}
        onOpenChange={setDialogoAbierto}
        title="Confirmar pago"
        description={subastaSeleccionada ? `Confirmas el pago de ${formatearMoneda(subastaSeleccionada.montoGanado)} por "${subastaSeleccionada.nombreProducto}"?` : ''}
        confirmText="Pagar"
        onConfirm={confirmarPago}
      />
    </div>
  );
}

export default PaginaGanadas;
