import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUsuario } from '../contextos/ContextoUsuario';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Card';
import { Button } from '../componentes/ui/Button';
import { Badge } from '../componentes/ui/Badge';
import { Plus } from 'lucide-react';
import { obtenerSubastas } from '../api/clienteApi';

function PaginaMisSubastas() {
  const { usuario } = useUsuario();
  const [subastas, setSubastas] = useState([]);

  useEffect(() => { cargar(); }, [usuario?.id]);

  const cargar = async () => {
    try { const r = await obtenerSubastas(); setSubastas((r.datos || r.data || []).filter(s => s.vendedorId === usuario.id)); }
    catch { }
  };

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
                  <Badge variant={s.estado === 'activa' ? 'success' : s.estado === 'cancelada' ? 'destructive' : 'secondary'}>{s.estado}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <p className="text-muted-foreground">Precio inicial: <span className="font-medium text-foreground">Bs {s.precioInicial.toFixed(2)}</span></p>
                  <p className="text-muted-foreground">Actual: <span className="font-medium text-primary">Bs {s.precioActual.toFixed(2)}</span></p>
                  <p className="text-muted-foreground">Pujas: <span className="font-medium text-foreground">{s.cantidadPujas}</span></p>
                  <p className="text-muted-foreground">Fin: <span className="font-medium text-foreground">{new Date(s.fechaFin).toLocaleDateString()}</span></p>
                </div>
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
