import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { listarUsuarios, cambiarRolUsuario, cancelarSubasta, obtenerSubastas, obtenerCategorias, crearCategoria, editarCategoria, suspenderUsuario, listarDenuncias, resolverDenuncia } from '../api/clienteApi';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Tarjeta';
import { Badge } from '../componentes/ui/Insignia';
import { Button } from '../componentes/ui/Boton';
import { Input } from '../componentes/ui/Entrada';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../componentes/ui/Selector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../componentes/ui/Pestanias';
import Confirmacion from '../componentes/ui/Confirmacion';
import { toastExito, toastError } from '../componentes/ui/NotificacionToast';
import { Users, Gavel, Tag, Plus, Pencil, X, Check, Ban, CircleCheck, AlertTriangle } from 'lucide-react';

function PaginaAdmin() {
  const location = useLocation();
  const hash = location.hash.replace('#', '') || 'usuarios';
  const [usuarios, setUsuarios] = useState([]);
  const [subastas, setSubastas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [denuncias, setDenuncias] = useState([]);
  const [dialogoRol, setDialogoRol] = useState({ abierto: false, usuarioId: null, rolId: null, nombre: '', rolNombre: '' });
  const [dialogoCancelar, setDialogoCancelar] = useState({ abierto: false, subastaId: null, nombre: '' });
  const [dialogoSuspender, setDialogoSuspender] = useState({ abierto: false, usuarioId: null, nombre: '', suspender: true });
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '', descripcion: '' });
  const [editandoCategoria, setEditandoCategoria] = useState(null);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const u = await listarUsuarios();
      setUsuarios(u.datos || []);
      const s = await obtenerSubastas();
      setSubastas((s.datos || s.data || []).filter(x => x.estado !== 'cancelada'));
      const c = await obtenerCategorias();
      setCategorias(c.datos || []);
      const d = await listarDenuncias();
      setDenuncias(d.datos || []);
    } catch { }
  };

  const confirmarCambioRol = async () => {
    try {
      await cambiarRolUsuario(dialogoRol.usuarioId, dialogoRol.rolId);
      toastExito('Rol actualizado exitosamente');
      cargar();
    } catch { toastError('Error al cambiar el rol'); }
  };

  const confirmarCancelar = async () => {
    try {
      await cancelarSubasta(dialogoCancelar.subastaId);
      toastExito('Subasta cancelada exitosamente');
      cargar();
    } catch { toastError('Error al cancelar la subasta'); }
  };

  const confirmarSuspender = async () => {
    try {
      await suspenderUsuario(dialogoSuspender.usuarioId, dialogoSuspender.suspender);
      toastExito(dialogoSuspender.suspender ? 'Usuario suspendido' : 'Usuario desbaneado');
      cargar();
    } catch { toastError('Error al cambiar el estado del usuario'); }
  };

  const handleCrearCategoria = async (e) => {
    e.preventDefault();
    if (!nuevaCategoria.nombre.trim()) return;
    try {
      await crearCategoria(nuevaCategoria);
      toastExito('Categoría creada exitosamente');
      setNuevaCategoria({ nombre: '', descripcion: '' });
      cargar();
    } catch { toastError('Error al crear la categoría'); }
  };

  const iniciarEditar = (c) => {
    setEditandoCategoria({ id: c.id, nombre: c.nombre, descripcion: c.descripcion || '' });
  };

  const guardarEditar = async () => {
    if (!editandoCategoria.nombre.trim()) return;
    try {
      await editarCategoria(editandoCategoria.id, { nombre: editandoCategoria.nombre, descripcion: editandoCategoria.descripcion });
      toastExito('Categoría actualizada');
      setEditandoCategoria(null);
      cargar();
    } catch { toastError('Error al editar la categoría'); }
  };

  const ROLES = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Vendedor' },
    { id: 3, nombre: 'Comprador' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6 page-enter">

      <Tabs defaultValue="usuarios" value={hash}>

        <TabsContent value="usuarios">
          <Card>
            <CardHeader><CardTitle>Gestión de usuarios ({usuarios.filter(u => u.rolNombre !== 'administrador').length})</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {usuarios.filter(u => u.rolNombre !== 'administrador').map(u => (
                  <div key={u.id} className={`flex items-center justify-between p-3 rounded-xl flex-wrap gap-2 ${u.estaSuspendido ? 'bg-red-50 dark:bg-red-950/20 border border-red-200' : 'bg-muted/50'}`}>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{u.nombreCompleto}</p>
                        {u.estaSuspendido && <Badge variant="destructive" className="text-[10px] gap-1"><Ban className="h-2.5 w-2.5" />Suspendido</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground">{u.correo}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{u.rolNombre}</Badge>
                      <Select
                        value={String(u.rolId)}
                        onValueChange={v => setDialogoRol({
                          abierto: true,
                          usuarioId: u.id,
                          rolId: parseInt(v),
                          nombre: u.nombreCompleto,
                          rolNombre: ROLES.find(r => r.id === parseInt(v))?.nombre
                        })}
                      >
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.nombre}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      {u.estaSuspendido ? (
                        <Button variant="outline" size="sm" onClick={() => setDialogoSuspender({ abierto: true, usuarioId: u.id, nombre: u.nombreCompleto, suspender: false })}>
                          <CircleCheck className="h-3 w-3 mr-1 text-green-600" />Desbanear
                        </Button>
                      ) : (
                        <Button variant="destructive" size="sm" onClick={() => setDialogoSuspender({ abierto: true, usuarioId: u.id, nombre: u.nombreCompleto, suspender: true })}>
                          <Ban className="h-3 w-3 mr-1" />Suspender
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categorias">
          <Card>
            <CardHeader><CardTitle>Crear categoria</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleCrearCategoria} className="flex gap-3 items-end flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <label className="text-xs text-muted-foreground mb-1 block">Nombre</label>
                  <Input value={nuevaCategoria.nombre} onChange={e => setNuevaCategoria(p => ({ ...p, nombre: e.target.value }))} placeholder="Ej: Electrónica" required />
                </div>
                <div className="flex-[2] min-w-[250px]">
                  <label className="text-xs text-muted-foreground mb-1 block">Descripcion (opcional)</label>
                  <Input value={nuevaCategoria.descripcion} onChange={e => setNuevaCategoria(p => ({ ...p, descripcion: e.target.value }))} placeholder="Dispositivos electrónicos y gadgets" />
                </div>
                <Button type="submit" size="sm"><Plus className="h-4 w-4 mr-1" />Crear</Button>
              </form>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardHeader><CardTitle>Categorias existentes ({categorias.length})</CardTitle></CardHeader>
            <CardContent>
              {categorias.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No hay categorias. Crea la primera arriba.</p>
              ) : (
                <div className="space-y-2">
                  {categorias.map(c => (
                    <div key={c.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                      {editandoCategoria?.id === c.id ? (
                        <div className="flex-1 flex gap-2 items-center flex-wrap">
                          <Input value={editandoCategoria.nombre} onChange={e => setEditandoCategoria(p => ({ ...p, nombre: e.target.value }))} className="min-w-[150px] flex-1" />
                          <Input value={editandoCategoria.descripcion} onChange={e => setEditandoCategoria(p => ({ ...p, descripcion: e.target.value }))} className="min-w-[200px] flex-[2]" placeholder="Descripción" />
                          <Button variant="ghost" size="icon" onClick={guardarEditar} title="Guardar"><Check className="h-4 w-4 text-green-600" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => setEditandoCategoria(null)} title="Cancelar"><X className="h-4 w-4 text-muted-foreground" /></Button>
                        </div>
                      ) : (
                        <>
                          <div>
                            <p className="font-medium">{c.nombre}</p>
                            {c.descripcion && <p className="text-xs text-muted-foreground">{c.descripcion}</p>}
                          </div>
                          <Button variant="ghost" size="icon" onClick={() => iniciarEditar(c)} title="Editar categoria">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subastas">
          <Card>
            <CardHeader><CardTitle>Subastas activas/finalizadas</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subastas.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-xl">
                    <div>
                      <p className="font-medium">{s.nombreProducto}</p>
                      <p className="text-xs text-muted-foreground">Vendedor: {s.nombreVendedor} | Bs {s.precioActual.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={s.estado === 'activa' ? 'success' : 'secondary'}>{s.estado}</Badge>
                      {s.estado !== 'cancelada' && (
                        <Button variant="destructive" size="sm" onClick={() => setDialogoCancelar({ abierto: true, subastaId: s.id, nombre: s.nombreProducto })}>Cancelar</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="denuncias">
          <Card>
            <CardHeader><CardTitle>Denuncias recibidas ({denuncias.length})</CardTitle></CardHeader>
            <CardContent>
              {denuncias.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">No hay denuncias pendientes.</p>
              ) : (
                <div className="space-y-3">
                  {denuncias.map(d => (
                    <div key={d.id} className="p-3 bg-muted/50 rounded-xl space-y-2">
                      <div className="flex items-start justify-between flex-wrap gap-2">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{d.denunciante} denunció a {d.denunciado}</p>
                          <p className="text-sm mt-1">{d.motivo}</p>
                          {d.descripcion && <p className="text-xs text-muted-foreground mt-1">{d.descripcion}</p>}
                          <p className="text-xs text-muted-foreground mt-1">{new Date(d.fechaCreacion).toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Badge variant={d.estado === 'pendiente' ? 'warning' : d.estado === 'resuelta' ? 'success' : 'outline'}>{d.estado}</Badge>
                          {d.estado === 'pendiente' && (
                            <>
                              <Button variant="destructive" size="sm" onClick={async () => {
                                try { await resolverDenuncia(d.id, 'suspender'); toastExito('Denuncia resuelta - usuario suspendido'); cargar(); } catch { toastError('Error al resolver'); }
                              }}>Suspender</Button>
                              <Button variant="outline" size="sm" onClick={async () => {
                                try { await resolverDenuncia(d.id, 'rechazar'); toastExito('Denuncia rechazada'); cargar(); } catch { toastError('Error al resolver'); }
                              }}>Rechazar</Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Confirmacion
        open={dialogoRol.abierto}
        onOpenChange={v => setDialogoRol(p => ({ ...p, abierto: v }))}
        title="Cambiar rol"
        description={`Estas seguro de cambiar el rol de "${dialogoRol.nombre}" a "${dialogoRol.rolNombre}"?`}
        confirmText="Cambiar"
        onConfirm={confirmarCambioRol}
      />

      <Confirmacion
        open={dialogoSuspender.abierto}
        onOpenChange={v => setDialogoSuspender(p => ({ ...p, abierto: v }))}
        title={dialogoSuspender.suspender ? 'Suspender usuario' : 'Desbanear usuario'}
        description={dialogoSuspender.suspender
          ? `Estas seguro de suspender a "${dialogoSuspender.nombre}"? No podra acceder a la plataforma.`
          : `Estas seguro de desbanear a "${dialogoSuspender.nombre}"? Podra volver a usar la plataforma.`}
        confirmText={dialogoSuspender.suspender ? 'Suspender' : 'Desbanear'}
        variant={dialogoSuspender.suspender ? 'destructive' : 'default'}
        onConfirm={confirmarSuspender}
      />

      <Confirmacion
        open={dialogoCancelar.abierto}
        onOpenChange={v => setDialogoCancelar(p => ({ ...p, abierto: v }))}
        title="Cancelar subasta"
        description={`Estas seguro de cancelar la subasta "${dialogoCancelar.nombre}"? Esta accion no se puede deshacer.`}
        confirmText="Cancelar subasta"
        variant="destructive"
        onConfirm={confirmarCancelar}
      />
    </div>
  );
}

export default PaginaAdmin;
