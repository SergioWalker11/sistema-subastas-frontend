import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { obtenerDetalleSubasta, obtenerPujasSubasta, registrarPuja, obtenerImagenesProducto, cancelarSubasta, editarSubasta } from '../api/clienteApi';
import { useUsuario } from '../contextos/ContextoUsuario';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Tarjeta';
import { Badge } from '../componentes/ui/Insignia';
import { Button } from '../componentes/ui/Boton';
import { Input, Label } from '../componentes/ui/Entrada';
import AlertaError from '../componentes/ui/AlertaError';
import Cargador from '../componentes/ui/Cargador';
import CuentaRegresiva from '../componentes/ui/CuentaRegresiva';
import AtajosPuja from '../componentes/ui/AtajosPuja';
import Confirmacion from '../componentes/ui/Confirmacion';
import FormularioPagoTarjeta from '../componentes/pagos/FormularioPagoTarjeta';
import { toastExito, toastError } from '../componentes/ui/NotificacionToast';
import { ESTADO_MAPA, ESTADO_VARIANTE } from '../utilidades/constantes';
import { formatearMoneda } from '../utilidades/formatearMoneda';
import { Clock, User, ArrowLeft, Star, Gavel, ChevronLeft, ChevronRight, Edit, AlertTriangle } from 'lucide-react';

const BASE_IMAGENES = 'http://localhost:5221';

function PaginaDetalleSubasta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { usuario } = useUsuario();
  const [subasta, setSubasta] = useState(null);
  const [pujas, setPujas] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [imgIndex, setImgIndex] = useState(0);
  const [monto, setMonto] = useState('');
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [dialogoAbierto, setDialogoAbierto] = useState(false);
  const [mostrarFormularioTarjeta, setMostrarFormularioTarjeta] = useState(false);
  const [editando, setEditando] = useState(false);
  const [editPrecio, setEditPrecio] = useState('');
  const [editFechaInicio, setEditFechaInicio] = useState('');
  const [editFechaFin, setEditFechaFin] = useState('');

  const esPropietario = usuario && subasta && usuario.id === subasta.vendedorId;
  const noHaIniciado = subasta && new Date(subasta.fechaInicio) > new Date();

  const cargar = async () => {
    try {
      const r = await obtenerDetalleSubasta(id);
      const s = r.datos;
      setSubasta(s);
      const p = await obtenerPujasSubasta(id, usuario?.id);
      setPujas(p.datos || []);
      if (s.productoId) {
        const img = await obtenerImagenesProducto(s.productoId);
        setImagenes(img.datos || []);
      }
    } catch { setError('Error al cargar'); }
    finally { setCargando(false); }
  };

  useEffect(() => { cargar(); }, [id]);

  const ejecutarPuja = async () => {
    if (!usuario) { setError('Debes iniciar sesion para pujar'); return; }
    const m = parseFloat(monto);
    if (!m || m < subasta.precioActual + 1) { setError(`Monto minimo: ${formatearMoneda(subasta.precioActual + 1)}`); return; }
    setEnviando(true); setError('');
    try {
      await registrarPuja({ subastaId: subasta.id, usuarioId: usuario.id, monto: m });
      toastExito('Puja registrada exitosamente');
      setMonto('');
      cargar();
    } catch (err) { toastError(err.response?.data?.mensaje || 'Error al pujar'); }
    finally { setEnviando(false); }
  };

  const abrirDialogoPuja = () => {
    const m = parseFloat(monto);
    if (!m || m < subasta.precioActual + 1) { setError(`Monto minimo: ${formatearMoneda(subasta.precioActual + 1)}`); return; }
    setError('');
    setDialogoAbierto(true);
  };

  const manejarCancelar = async () => {
    setEnviando(true);
    try {
      await cancelarSubasta(subasta.id, usuario.id);
      toastExito('Subasta cancelada');
      cargar();
    } catch (err) { toastError(err.response?.data?.mensaje || 'Error al cancelar'); }
    finally { setEnviando(false); }
  };

  const abrirEditar = () => {
    setEditPrecio(subasta.precioInicial.toString());
    setEditFechaInicio(new Date(subasta.fechaInicio).toISOString().slice(0, 16));
    setEditFechaFin(new Date(subasta.fechaFin).toISOString().slice(0, 16));
    setError('');
    setEditando(true);
  };

  const ejecutarEditar = async (e) => {
    e.preventDefault();
    setEnviando(true); setError('');
    try {
      await editarSubasta(subasta.id, {
        precioInicial: parseFloat(editPrecio),
        fechaInicio: new Date(editFechaInicio).toISOString(),
        fechaFin: new Date(editFechaFin).toISOString(),
      });
      toastExito('Subasta actualizada');
      setEditando(false);
      cargar();
    } catch (err) { toastError(err.response?.data?.mensaje || 'Error al editar'); }
    finally { setEnviando(false); }
  };

  const siguienteImg = () => setImgIndex(i => (i + 1) % imagenes.length);
  const anteriorImg = () => setImgIndex(i => (i - 1 + imagenes.length) % imagenes.length);

  if (cargando) return <Cargador />;
  if (!subasta) return <Cargador mensaje="Subasta no encontrada" />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 page-enter">
      <Button variant="ghost" onClick={() => navigate('/')} size="sm"><ArrowLeft className="h-4 w-4 mr-1" />Volver</Button>

      {imagenes.length > 0 && (
        <div className="relative rounded-xl overflow-hidden bg-black/5">
          <img src={`${BASE_IMAGENES}/ImagenesProductos/${imagenes[imgIndex].rutaArchivo}`} alt={subasta.nombreProducto} className="w-full h-64 md:h-80 object-contain bg-muted" />
          {imagenes.length > 1 && (
            <>
              <button onClick={anteriorImg} className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1.5 shadow">
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button onClick={siguienteImg} className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 hover:bg-background rounded-full p-1.5 shadow">
                <ChevronRight className="h-5 w-5" />
              </button>
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                {imagenes.map((_, i) => (
                  <button key={i} onClick={() => setImgIndex(i)} className={`w-2 h-2 rounded-full transition-colors ${i === imgIndex ? 'bg-primary' : 'bg-white/60'}`} />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-2xl">{subasta.nombreProducto}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1"><User className="h-3 w-3" />Vendedor: {subasta.nombreVendedor}</p>
              {subasta.nombreGanador && <p className="text-sm text-muted-foreground mt-1">Ganador: {subasta.nombreGanador}</p>}
              {subasta.fechaLimitePago && <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1"><Clock className="h-3 w-3" />Limite de pago: {new Date(subasta.fechaLimitePago).toLocaleString()}</p>}
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={ESTADO_VARIANTE[subasta.estado] || 'outline'} className="text-sm px-3 py-1">{ESTADO_MAPA[subasta.estado] || subasta.estado}</Badge>
              {subasta.estado === 'activa' && <CuentaRegresiva endsAt={subasta.fechaFin} />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{subasta.descripcionProducto}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-xl">
            <div><p className="text-xs text-muted-foreground">Precio inicial</p><p className="font-semibold">{formatearMoneda(subasta.precioInicial)}</p></div>
            <div><p className="text-xs text-muted-foreground">Precio actual</p><p className="text-xl font-bold text-primary">{formatearMoneda(subasta.precioActual)}</p></div>
            <div><p className="text-xs text-muted-foreground">Inicio</p><p className="text-sm">{new Date(subasta.fechaInicio).toLocaleString()}</p></div>
            <div><p className="text-xs text-muted-foreground">Fin</p><p className="text-sm">{new Date(subasta.fechaFin).toLocaleString()}</p></div>
          </div>
          <p className="text-sm text-muted-foreground"><Gavel className="h-3 w-3 inline mr-1" />{subasta.cantidadPujas} pujas realizadas</p>
          {usuario && !esPropietario && (
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-600" onClick={() => navigate(`/denunciar?denunciadoId=${subasta.vendedorId}&denunciadoNombre=${encodeURIComponent(subasta.nombreVendedor)}`)}>
              <AlertTriangle className="h-3 w-3 mr-1" />Denunciar vendedor
            </Button>
          )}
          {usuario && esPropietario && subasta.ganadorId && (
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-600" onClick={() => navigate(`/denunciar?denunciadoId=${subasta.ganadorId}&denunciadoNombre=${encodeURIComponent(subasta.nombreGanador)}`)}>
              <AlertTriangle className="h-3 w-3 mr-1" />Denunciar comprador
            </Button>
          )}
        </CardContent>
      </Card>

      {esPropietario && subasta.estado === 'activa' && (
        <Card className="border-blue-200">
          <CardHeader><CardTitle>Acciones del vendedor</CardTitle></CardHeader>
          <CardContent className="flex gap-2 flex-wrap">
            {noHaIniciado && (
              <Button variant="outline" size="sm" onClick={abrirEditar}><Edit className="h-4 w-4 mr-1" />Editar</Button>
            )}
            <Button variant="destructive" size="sm" onClick={manejarCancelar} disabled={enviando}>Cancelar subasta</Button>
          </CardContent>
        </Card>
      )}

      {editando && (
        <Card className="border-blue-300">
          <CardHeader><CardTitle>Editar subasta</CardTitle></CardHeader>
          <CardContent>
            {error && <AlertaError mensaje={error} cerrar={() => setError('')} />}
            <form onSubmit={ejecutarEditar} className="space-y-4">
              <div>
                <Label htmlFor="editPrecio">Precio inicial</Label>
                <Input id="editPrecio" type="number" value={editPrecio} onChange={e => setEditPrecio(e.target.value)} required min="1" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="editInicio">Fecha y hora de inicio</Label>
                  <Input id="editInicio" type="datetime-local" value={editFechaInicio} onChange={e => setEditFechaInicio(e.target.value)} required />
                </div>
                <div>
                  <Label htmlFor="editFin">Fecha y hora de fin</Label>
                  <Input id="editFin" type="datetime-local" value={editFechaFin} onChange={e => setEditFechaFin(e.target.value)} required />
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={enviando}>{enviando ? 'Guardando...' : 'Guardar cambios'}</Button>
                <Button type="button" variant="ghost" onClick={() => setEditando(false)}>Cancelar</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {subasta.estado === 'activa' && !esPropietario && usuario?.rol !== 'vendedor' && (
        <Card className="border-primary/20">
          <CardHeader><CardTitle className="flex items-center gap-2"><Gavel className="h-5 w-5 text-primary" />Realizar puja</CardTitle></CardHeader>
          <CardContent>
            {!usuario && <p className="text-sm text-muted-foreground mb-4">Debes <a href="/login" className="text-primary underline">iniciar sesion</a> para pujar</p>}
            <form onSubmit={e => { e.preventDefault(); abrirDialogoPuja(); }} className="space-y-3">
              {error && <AlertaError mensaje={error} cerrar={() => setError('')} />}
              <div>
                <Label htmlFor="monto">Monto de la puja</Label>
                <div className="mt-1">
                  <AtajosPuja precioMinimo={subasta.precioActual + 1} onSelect={m => setMonto(m.toString())} />
                </div>
                <Input id="monto" type="number" value={monto} onChange={e => setMonto(e.target.value)} placeholder={`Minimo ${formatearMoneda(subasta.precioActual + 1)}`} required disabled={!usuario} className="mt-2" />
              </div>
              <Button type="submit" disabled={enviando || !usuario} size="lg" className="w-full">{enviando ? 'Registrando...' : 'Realizar puja'}</Button>
            </form>
            <Confirmacion
              open={dialogoAbierto}
              onOpenChange={setDialogoAbierto}
              title="Confirmar puja"
              description={`Estas a punto de pujar ${formatearMoneda(parseFloat(monto))} en esta subasta. Esta accion no se puede deshacer.`}
              confirmText="Pujar"
              onConfirm={ejecutarPuja}
            />
          </CardContent>
        </Card>
      )}

      {subasta.estado === 'pendiente_pago' && usuario && subasta.ganadorId === usuario.id && (
        <Card>
          <CardHeader><CardTitle>Pagar subasta</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {mostrarFormularioTarjeta ? (
              <FormularioPagoTarjeta
                monto={subasta.precioActual}
                subastaId={subasta.id}
                usuarioId={usuario.id}
                onCompletado={() => { setMostrarFormularioTarjeta(false); cargar(); }}
                onCancelar={() => setMostrarFormularioTarjeta(false)}
              />
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Eres el ganador de esta subasta. El monto a pagar es de <strong>{formatearMoneda(subasta.precioActual)}</strong></p>
                <Button onClick={() => setMostrarFormularioTarjeta(true)} size="lg" className="w-full">Pagar con tarjeta</Button>
              </>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Historial de pujas</CardTitle></CardHeader>
        <CardContent>
          {pujas.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">Aun no hay pujas</p>
          ) : (
            <div className="space-y-2">
              {pujas.map((p, i) => (
                <div key={p.id} className={`flex justify-between items-center p-3 rounded-lg card-enter ${p.esPropia ? 'bg-primary/5 border border-primary/20' : 'bg-muted/50'}`} style={{ animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`font-medium ${p.esPropia ? 'text-primary' : ''}`}>{p.nombreUsuario}</p>
                        {p.esPropia && <Badge variant="success" className="text-[10px] px-1.5 py-0"><Star className="h-2.5 w-2.5 mr-0.5" />Tu puja</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(p.fechaCreacion).toLocaleString()}</p>
                    </div>
                  </div>
                  <p className={`font-bold text-lg ${p.esPropia ? 'text-primary' : ''}`}>{formatearMoneda(p.monto)}</p>
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
