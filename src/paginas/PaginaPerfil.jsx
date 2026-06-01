import { useState, useEffect } from 'react';
import { useUsuario } from '../contextos/ContextoUsuario';
import { obtenerPerfil, guardarDatosBancarios } from '../api/clienteApi';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Tarjeta';
import { Input, Label } from '../componentes/ui/Entrada';
import { Button } from '../componentes/ui/Boton';
import { Badge } from '../componentes/ui/Insignia';
import Cargador from '../componentes/ui/Cargador';
import { toastExito, toastError } from '../componentes/ui/NotificacionToast';
import { User, Building2, Ban } from 'lucide-react';

function PaginaPerfil() {
  const { usuario } = useUsuario();
  const [perfil, setPerfil] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [banco, setBanco] = useState('');
  const [tipoCuenta, setTipoCuenta] = useState('ahorros');
  const [numeroCuenta, setNumeroCuenta] = useState('');
  const [titular, setTitular] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    if (!usuario) return;
    obtenerPerfil(usuario.id).then(r => {
      const p = r.datos;
      setPerfil(p);
      if (p.datosBancarios) {
        setBanco(p.datosBancarios.banco || '');
        setTipoCuenta(p.datosBancarios.tipoCuenta || 'ahorros');
        setNumeroCuenta(p.datosBancarios.numeroCuenta || '');
        setTitular(p.datosBancarios.titular || '');
      }
    }).catch(() => {}).finally(() => setCargando(false));
  }, [usuario]);

  const guardar = async () => {
    setGuardando(true);
    try {
      await guardarDatosBancarios(usuario.id, { banco, tipoCuenta, numeroCuenta, titular });
      toastExito('Datos bancarios guardados');
    } catch (err) {
      toastError(err.response?.data?.mensaje || 'Error al guardar');
    } finally { setGuardando(false); }
  };

  if (cargando) return <Cargador />;
  if (!perfil) return <p>No se encontro el perfil</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><User className="h-5 w-5" />Información personal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-muted-foreground">Nombre</p><p className="font-medium">{perfil.nombreCompleto}</p></div>
            <div><p className="text-xs text-muted-foreground">Correo</p><p className="font-medium">{perfil.correo}</p></div>
            <div><p className="text-xs text-muted-foreground">Rol</p><Badge variant="outline">{perfil.rol}</Badge></div>
            <div>
              <p className="text-xs text-muted-foreground">Estado</p>
              {perfil.estaSuspendido ? (
                <Badge variant="destructive" className="gap-1"><Ban className="h-3 w-3" />Suspendido</Badge>
              ) : (
                <Badge variant="success">Activo</Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {usuario?.rol === 'vendedor' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Building2 className="h-5 w-5" />Datos bancarios para recibir pagos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="banco">Banco</Label>
              <Input id="banco" value={banco} onChange={e => setBanco(e.target.value)} placeholder="Ej: Banco de Bogotá" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tipoCuenta">Tipo de cuenta</Label>
                <select id="tipoCuenta" value={tipoCuenta} onChange={e => setTipoCuenta(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                  <option value="ahorros">Ahorros</option>
                  <option value="corriente">Corriente</option>
                </select>
              </div>
              <div>
                <Label htmlFor="numCuenta">Número de cuenta</Label>
                <Input id="numCuenta" value={numeroCuenta} onChange={e => setNumeroCuenta(e.target.value)} placeholder="000-000000-00" />
              </div>
            </div>
            <div>
              <Label htmlFor="titular">Titular de la cuenta</Label>
              <Input id="titular" value={titular} onChange={e => setTitular(e.target.value)} placeholder="Nombre completo del titular" />
            </div>
            <Button onClick={guardar} disabled={guardando}>{guardando ? 'Guardando...' : 'Guardar datos bancarios'}</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default PaginaPerfil;
