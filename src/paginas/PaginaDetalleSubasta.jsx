import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerDetalleSubasta, obtenerPujasSubasta, registrarPuja } from '../api/clienteApi';
import { useUsuario } from '../contextos/ContextoUsuario';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Card';
import { Badge } from '../componentes/ui/Badge';
import { Button } from '../componentes/ui/Button';
import { Input, Label } from '../componentes/ui/Input';

function PaginaDetalleSubasta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useUsuario();
  const [subasta, setSubasta] = useState(null);
  const [pujas, setPujas] = useState([]);
  const [monto, setMonto] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const [enviando, setEnviando] = useState(false);

  const cargar = async () => {
    try {
      const r = await obtenerDetalleSubasta(id);
      setSubasta(r.datos);
      const p = await obtenerPujasSubasta(id);
      setPujas(p.datos || []);
    } catch { setError('Error al cargar'); }
    finally { setCargando(false); }
  };

  useEffect(() => { cargar(); }, [id]);

  const pujar = async (e) => {
    e.preventDefault();
    if (!usuario) { setError('Debes iniciar sesión para pujar'); return; }
    const m = parseFloat(monto);
    if (m < subasta.precioActual + 1) { setError(`Monto mínimo: Bs ${(subasta.precioActual + 1).toFixed(2)}`); return; }
    setEnviando(true); setError(''); setExito('');
    try {
      await registrarPuja({ subastaId: subasta.id, usuarioId: usuario.id, monto: m });
      setExito('Puja registrada exitosamente');
      setMonto('');
      cargar();
    } catch (err) { setError(err.response?.data?.mensaje || 'Error al pujar'); }
    finally { setEnviando(false); }
  };

  if (cargando) return <p className="text-center py-8 text-muted-foreground">Cargando...</p>;
  if (!subasta) return <p className="text-center py-8 text-muted-foreground">Subasta no encontrada</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/')}>← Volver</Button>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{subasta.nombreProducto}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">Vendedor: {subasta.nombreVendedor}</p>
            </div>
            <Badge variant={subasta.estado === 'activa' ? 'success' : 'secondary'} className="text-sm px-3 py-1">{subasta.estado}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{subasta.descripcionProducto}</p>
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div><p className="text-xs text-muted-foreground">Precio inicial</p><p className="font-semibold">Bs {subasta.precioInicial.toFixed(2)}</p></div>
            <div><p className="text-xs text-muted-foreground">Precio actual</p><p className="text-xl font-bold text-primary">Bs {subasta.precioActual.toFixed(2)}</p></div>
            <div><p className="text-xs text-muted-foreground">Inicio</p><p className="text-sm">{new Date(subasta.fechaInicio).toLocaleString()}</p></div>
            <div><p className="text-xs text-muted-foreground">Fin</p><p className="text-sm">{new Date(subasta.fechaFin).toLocaleString()}</p></div>
          </div>
          <p className="text-sm text-muted-foreground">{subasta.cantidadPujas} pujas realizadas</p>
        </CardContent>
      </Card>

      {subasta.estado === 'activa' && (
        <Card>
          <CardHeader><CardTitle>Realizar puja</CardTitle></CardHeader>
          <CardContent>
            {!usuario && <p className="text-sm text-muted-foreground mb-4">Debes <a href="/login" className="text-primary underline">iniciar sesión</a> para pujar</p>}
            <form onSubmit={pujar} className="space-y-3">
              {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
              {exito && <div className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded-md">{exito}</div>}
              <div>
                <Label htmlFor="monto">Monto (Bs)</Label>
                <Input id="monto" type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder={`Mínimo Bs ${(subasta.precioActual + 1).toFixed(2)}`} required disabled={!usuario} />
              </div>
              <Button type="submit" disabled={enviando || !usuario}>{enviando ? 'Registrando...' : 'Realizar puja'}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Historial de pujas</CardTitle></CardHeader>
        <CardContent>
          {pujas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aún no hay pujas</p>
          ) : (
            <div className="space-y-2">
              {pujas.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{p.nombreUsuario}</p>
                    <p className="text-xs text-muted-foreground">{new Date(p.fechaCreacion).toLocaleString()}</p>
                  </div>
                  <p className="font-bold text-primary">Bs {p.monto.toFixed(2)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default PaginaDetalleSubasta;
