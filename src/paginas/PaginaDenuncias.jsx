import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { listarDenuncias, resolverDenuncia } from '../api/clienteApi';
import { useUsuario } from '../contextos/ContextoUsuario';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Tarjeta';
import { Badge } from '../componentes/ui/Insignia';
import { Button } from '../componentes/ui/Boton';
import Cargador from '../componentes/ui/Cargador';
import { toastExito } from '../componentes/ui/NotificacionToast';
import { ShieldAlert, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

function PaginaDenuncias() {
  const { usuario } = useUsuario();
  const [denuncias, setDenuncias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const esAdmin = usuario?.rol === 'administrador';

  useEffect(() => {
    if (!esAdmin) return;
    listarDenuncias().then(r => setDenuncias(r.datos || [])).catch(() => {}).finally(() => setCargando(false));
  }, []);

  const resolver = async (id, accion) => {
    try {
      await resolverDenuncia(id, accion);
      toastExito(accion === 'suspender' ? 'Usuario suspendido' : 'Denuncia rechazada');
      const r = await listarDenuncias();
      setDenuncias(r.datos || []);
    } catch {}
  };

  if (!esAdmin) return <p className="text-center text-muted-foreground py-12">Solo el administrador puede ver esta pagina</p>;
  if (cargando) return <Cargador />;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-2">
        <ShieldAlert className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Denuncias</h1>
      </div>

      {denuncias.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No hay denuncias</p>
      ) : (
        <div className="space-y-4">
          {denuncias.map(d => (
            <Card key={d.id} className={d.estado === 'pendiente' ? 'border-amber-200' : ''}>
              <CardContent className="p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{d.denunciante} denunció a {d.denunciado}</p>
                    <p className="text-sm text-muted-foreground mt-1">{d.motivo}</p>
                    <p className="text-xs text-muted-foreground mt-2">{new Date(d.fechaCreacion).toLocaleString()}</p>
                  </div>
                  <Badge variant={d.estado === 'pendiente' ? 'warning' : d.estado === 'resuelta' ? 'success' : 'outline'}>{d.estado}</Badge>
                </div>
                {d.estado === 'pendiente' && (
                  <div className="flex gap-2">
                    <Button size="sm" variant="destructive" onClick={() => resolver(d.id, 'suspender')}>
                      <AlertTriangle className="h-3 w-3 mr-1" />Suspender
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => resolver(d.id, 'rechazar')}>
                      <XCircle className="h-3 w-3 mr-1" />Rechazar
                    </Button>
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

export default PaginaDenuncias;
