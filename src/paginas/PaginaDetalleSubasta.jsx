import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerDetalleSubasta, obtenerPujasSubasta, registrarPuja, procesarPago } from '../api/clienteApi';
import { useUsuario } from '../contextos/ContextoUsuario';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Card';
import { Badge } from '../componentes/ui/Badge';
import { Button } from '../componentes/ui/Button';
import { Input, Label } from '../componentes/ui/Input';
import { Clock, User } from 'lucide-react';

const ESTADO_MAPA = { activa: 'Activa', pendiente_pago: 'Pendiente de pago', vendida: 'Vendida', incumplida: 'Incumplida', cancelada: 'Cancelada' };
const ESTADO_VARIANTE = { activa: 'success', pendiente_pago: 'default', vendida: 'secondary', incumplida: 'destructive', cancelada: 'destructive' };

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
    if (!usuario) { setError('Debes iniciar sesion para pujar'); return; }
    const m = parseFloat(monto);
    if (m < subasta.precioActual + 1) { setError(`Monto minimo: ${(subasta.precioActual + 1).toLocaleString('es-BO', { style: 'currency', currency: 'BOB' })}`); return; }
    setEnviando(true); setError(''); setExito('');
    try {
      await registrarPuja({ subastaId: subasta.id, usuarioId: usuario.id, monto: m });
      setExito('Puja registrada exitosamente');
      setMonto('');
      cargar();
    } catch (err) { setError(err.response?.data?.mensaje || 'Error al pujar'); }
    finally { setEnviando(false); }
  };

  const pagar = async () => {
    if (!usuario || !subasta) return;
    setEnviando(true); setError('');
    try {
      await procesarPago({ subastaId: subasta.id, usuarioId: usuario.id, monto: subasta.precioActual });
      setExito('Pago procesado exitosamente');
      cargar();
    } catch (err) { setError(err.response?.data?.mensaje || 'Error al procesar el pago'); }
    finally { setEnviando(false); }
  };

  if (cargando) return <p className="text-center py-8 text-muted-foreground">Cargando...</p>;
  if (!subasta) return <p className="text-center py-8 text-muted-foreground">Subasta no encontrada</p>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Button variant="ghost" onClick={() => navigate('/')}>Volver</Button>
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{subasta.nombreProducto}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1"><User className="h-3 w-3 inline mr-1" />Vendedor: {subasta.nombreVendedor}</p>
              {subasta.nombreGanador && <p className="text-sm text-muted-foreground mt-1">Ganador: {subasta.nombreGanador}</p>}
              {subasta.fechaLimitePago && <p className="text-sm text-muted-foreground mt-1"><Clock className="h-3 w-3 inline mr-1" />Limite de pago: {new Date(subasta.fechaLimitePago).toLocaleString()}</p>}
            </div>
            <Badge variant={ESTADO_VARIANTE[subasta.estado] || 'outline'} className="text-sm px-3 py-1">{ESTADO_MAPA[subasta.estado] || subasta.estado}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{subasta.descripcionProducto}</p>
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
            <div><p className="text-xs text-muted-foreground">Precio inicial</p><p className="font-semibold">{subasta.precioInicial.toLocaleString('es-BO', { style: 'currency', currency: 'BOB' })}</p></div>
            <div><p className="text-xs text-muted-foreground">Precio actual</p><p className="text-xl font-bold text-primary">{subasta.precioActual.toLocaleString('es-BO', { style: 'currency', currency: 'BOB' })}</p></div>
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
            {!usuario && <p className="text-sm text-muted-foreground mb-4">Debes <a href="/login" className="text-primary underline">iniciar sesion</a> para pujar</p>}
            <form onSubmit={pujar} className="space-y-3">
              {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
              {exito && <div className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded-md">{exito}</div>}
              <div>
                <Label htmlFor="monto">Monto</Label>
                <Input id="monto" type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder={`Minimo ${(subasta.precioActual + 1).toLocaleString('es-BO', { style: 'currency', currency: 'BOB' })}`} required disabled={!usuario} />
              </div>
              <Button type="submit" disabled={enviando || !usuario}>{enviando ? 'Registrando...' : 'Realizar puja'}</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {subasta.estado === 'pendiente_pago' && usuario && subasta.ganadorId === usuario.id && (
        <Card>
          <CardHeader><CardTitle>Pagar subasta</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
            {exito && <div className="text-sm text-emerald-700 bg-emerald-50 p-3 rounded-md">{exito}</div>}
            <p className="text-sm text-muted-foreground">Eres el ganador de esta subasta. El monto a pagar es de <strong>{subasta.precioActual.toLocaleString('es-BO', { style: 'currency', currency: 'BOB' })}</strong></p>
            <Button onClick={pagar} disabled={enviando}>{enviando ? 'Procesando...' : 'Pagar ahora'}</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Historial de pujas</CardTitle></CardHeader>
        <CardContent>
          {pujas.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aun no hay pujas</p>
          ) : (
            <div className="space-y-2">
              {pujas.map(p => (
                <div key={p.id} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                  <div>
                    <p className="font-medium">{p.nombreUsuario}</p>
                    <p className="text-xs text-muted-foreground">{new Date(p.fechaCreacion).toLocaleString()}</p>
                  </div>
                  <p className="font-bold text-primary">{p.monto.toLocaleString('es-BO', { style: 'currency', currency: 'BOB' })}</p>
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
