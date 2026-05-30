import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUsuario } from '../contextos/ContextoUsuario';
import { obtenerSubastasVendedor } from '../api/clienteApi';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Card';
import { Button } from '../componentes/ui/Button';
import { Badge } from '../componentes/ui/Badge';
import { Plus } from 'lucide-react';

const ESTADO_MAPA = { activa: 'Activa', pendiente_pago: 'Pendiente de pago', vendida: 'Vendida', incumplida: 'Incumplida', cancelada: 'Cancelada' };
const ESTADO_VARIANTE = { activa: 'success', pendiente_pago: 'default', vendida: 'secondary', incumplida: 'destructive', cancelada: 'destructive' };

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

  if (cargando) return <p className="text-center py-8 text-muted-foreground">Cargando...</p>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Mis subastas</h1>
        <Link to="/crear-producto"><Button><Plus className="h-4 w-4 mr-1" /> Nueva subasta</Button></Link>
      </div>
      {subastas.length === 0 ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">No has creado ninguna subasta aún.</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {subastas.map(s => (
            <Card key={s.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{s.nombreProducto}</CardTitle>
                  <Badge variant={ESTADO_VARIANTE[s.estado] || 'outline'}>{ESTADO_MAPA[s.estado] || s.estado}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-muted-foreground">Inicial: <span className="font-medium text-foreground">{s.precioInicial.toLocaleString('es-BO', { style: 'currency', currency: 'BOB' })}</span></p>
                  <p className="text-muted-foreground">Actual: <span className="font-medium text-primary">{s.precioActual.toLocaleString('es-BO', { style: 'currency', currency: 'BOB' })}</span></p>
                  <p className="text-muted-foreground">Pujas: <span className="font-medium text-foreground">{s.cantidadPujas}</span></p>
                  <p className="text-muted-foreground">Fin: <span className="font-medium text-foreground">{new Date(s.fechaFin).toLocaleDateString()}</span></p>
                </div>
                {s.nombreGanador && <p className="text-sm text-muted-foreground mt-2">Ganador: {s.nombreGanador}</p>}
                <Link to={`/subasta/${s.id}`}><Button variant="outline" size="sm" className="mt-4 w-full">Ver detalle</Button></Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaginaMisSubastas;
