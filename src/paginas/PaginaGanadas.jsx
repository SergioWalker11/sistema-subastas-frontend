import { useState, useEffect } from 'react';
import { obtenerSubastasGanadas } from '../api/clienteApi';
import { useUsuario } from '../contextos/ContextoUsuario';
import { Card, CardContent } from '../componentes/ui/Tarjeta';
import { Badge } from '../componentes/ui/Insignia';
import { Button } from '../componentes/ui/Boton';
import EstadoVacio from '../componentes/ui/EstadoVacio';
import Cargador from '../componentes/ui/Cargador';
import { ESTADO_MAPA, ESTADO_VARIANTE } from '../utilidades/constantes';
import { formatearMoneda } from '../utilidades/formatearMoneda';
import { Clock, Trophy, Mail, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function PaginaGanadas() {
  const { usuario } = useUsuario();
  const navigate = useNavigate();
  const [ganadas, setGanadas] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargar = async () => {
    try {
      const r = await obtenerSubastasGanadas(usuario.id);
      setGanadas(r.datos || []);
    } catch { }
    finally { setCargando(false); }
  };

  useEffect(() => { if (usuario) cargar(); }, [usuario?.id]);

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
                  <p className="text-xs text-muted-foreground flex items-center gap-1"><Mail className="h-3 w-3" />{g.correoVendedor || 'No disponible'}</p>
                  <p className="text-sm text-muted-foreground">Finalizó: {new Date(g.fechaFin).toLocaleDateString()}</p>
                  {g.fechaLimitePago && <p className="text-sm text-muted-foreground"><Clock className="h-3 w-3 inline mr-1" />Límite de pago: {new Date(g.fechaLimitePago).toLocaleString()}</p>}
                  <p className="text-lg font-bold text-primary mt-1">{formatearMoneda(g.montoGanado)}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <Badge variant={ESTADO_VARIANTE[g.estado] || 'outline'}>{ESTADO_MAPA[g.estado] || g.estado}</Badge>
                  {!g.pagado && g.estado === 'pendiente_pago' && (
                    <Button size="sm" onClick={() => navigate(`/subasta/${g.id}`)}>
                      <DollarSign className="h-4 w-4 mr-1" />Pagar ahora
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default PaginaGanadas;
