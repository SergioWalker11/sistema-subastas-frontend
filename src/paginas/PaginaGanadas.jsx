import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { obtenerSubastasGanadas, procesarPago } from '../api/clienteApi';
import { useUsuario } from '../contextos/ContextoUsuario';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Card';
import { Badge } from '../componentes/ui/Badge';
import { Button } from '../componentes/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../componentes/ui/Dialog';

function PaginaGanadas() {
  const { usuario } = useUsuario();
  const [ganadas, setGanadas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [pagoAbierto, setPagoAbierto] = useState(false);
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

  const pagar = async () => {
    setPagando(true);
    try {
      await procesarPago({ subastaId: subastaSeleccionada.id, usuarioId: usuario.id, monto: subastaSeleccionada.montoGanado });
      setPagoAbierto(false);
      cargar();
    } catch { }
    finally { setPagando(false); }
  };

  if (cargando) return <p className="text-center py-8 text-muted-foreground">Cargando...</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Subastas ganadas</h1>
      {ganadas.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">Aún no has ganado ninguna subasta.</CardContent></Card>
      ) : (
        ganadas.map(g => (
          <Card key={g.id}>
            <CardContent className="p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">{g.nombreProducto}</p>
                <p className="text-sm text-muted-foreground">Vendedor: {g.nombreVendedor}</p>
                <p className="text-sm text-muted-foreground">Finalizó: {new Date(g.fechaFin).toLocaleDateString()}</p>
                <p className="text-lg font-bold text-primary mt-1">Bs {g.montoGanado.toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge variant={g.pagado ? 'success' : 'secondary'}>{g.pagado ? 'Pagado' : 'Pendiente'}</Badge>
                {!g.pagado && (
                  <Button size="sm" onClick={() => { setSubastaSeleccionada(g); setPagoAbierto(true); }}>Pagar ahora</Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <Dialog open={pagoAbierto} onOpenChange={setPagoAbierto}>
        <DialogContent>
          <DialogHeader><DialogTitle>Confirmar pago</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Subasta: {subastaSeleccionada?.nombreProducto}</p>
            <p className="text-lg font-bold">Monto: Bs {subastaSeleccionada?.montoGanado?.toFixed(2)}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPagoAbierto(false)}>Cancelar</Button>
            <Button onClick={pagar} disabled={pagando}>{pagando ? 'Procesando...' : 'Confirmar pago'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PaginaGanadas;
