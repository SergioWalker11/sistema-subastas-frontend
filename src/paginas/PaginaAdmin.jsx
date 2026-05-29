import { useState, useEffect } from 'react';
import { listarUsuarios, cambiarRolUsuario, cancelarSubasta, obtenerSubastas } from '../api/clienteApi';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Card';
import { Badge } from '../componentes/ui/Badge';
import { Button } from '../componentes/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../componentes/ui/Select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../componentes/ui/Tabs';

function PaginaAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [subastas, setSubastas] = useState([]);

  useEffect(() => { cargar(); }, []);

  const cargar = async () => {
    try {
      const u = await listarUsuarios();
      setUsuarios(u.datos || []);
      const s = await obtenerSubastas();
      setSubastas((s.datos || s.data || []).filter(x => x.estado !== 'cancelada'));
    } catch { }
  };

  const cambiarRol = async (uid, rid) => {
    await cambiarRolUsuario(uid, rid);
    cargar();
  };

  const cancelar = async (id) => {
    await cancelarSubasta(id);
    cargar();
  };

  const ROLES = [
    { id: 1, nombre: 'Administrador' },
    { id: 2, nombre: 'Vendedor' },
    { id: 3, nombre: 'Comprador' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">🛡️ Panel de Administración</h1>
      <Tabs defaultValue="usuarios">
        <TabsList>
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="subastas">Subastas</TabsTrigger>
        </TabsList>
        <TabsContent value="usuarios">
          <Card>
            <CardHeader><CardTitle>Gestión de usuarios</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {usuarios.map(u => (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{u.nombreCompleto}</p>
                      <p className="text-xs text-muted-foreground">{u.correo}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{u.rolNombre}</Badge>
                      <Select onValueChange={v => cambiarRol(u.id, parseInt(v))} defaultValue={String(u.rolId)}>
                        <SelectTrigger className="w-32 h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLES.map(r => <SelectItem key={r.id} value={String(r.id)}>{r.nombre}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="subastas">
          <Card>
            <CardHeader><CardTitle>Subastas activas/finalizadas</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-3">
                {subastas.map(s => (
                  <div key={s.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">{s.nombreProducto}</p>
                      <p className="text-xs text-muted-foreground">Vendedor: {s.nombreVendedor} | Bs {s.precioActual.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={s.estado === 'activa' ? 'success' : 'secondary'}>{s.estado}</Badge>
                      {s.estado !== 'cancelada' && (
                        <Button variant="destructive" size="sm" onClick={() => cancelar(s.id)}>Cancelar</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PaginaAdmin;
