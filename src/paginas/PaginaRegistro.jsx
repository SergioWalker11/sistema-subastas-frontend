import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsuario } from '../contextos/ContextoUsuario';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Card';
import { Button } from '../componentes/ui/Button';
import { Input, Label } from '../componentes/ui/Input';

function PaginaRegistro() {
  const { registrarUsuario } = useUsuario();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [rolId, setRolId] = useState(3);
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await registrarUsuario(nombre, correo, contrasena, rolId);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16">
      <Card>
        <CardHeader><CardTitle className="text-center">Registro</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
            <div><Label htmlFor="nombre">Nombre completo</Label><Input id="nombre" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Tu nombre" required /></div>
            <div><Label htmlFor="correo">Correo</Label><Input id="correo" type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="tu@correo.com" required /></div>
            <div><Label htmlFor="contrasena">Contraseña</Label><Input id="contrasena" type="password" value={contrasena} onChange={e => setContrasena(e.target.value)} placeholder="Mínimo 6 caracteres" required /></div>
            <div>
              <Label htmlFor="rol">Tipo de cuenta</Label>
              <select id="rol" value={rolId} onChange={e => setRolId(parseInt(e.target.value))} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value={3}>Comprador</option>
                <option value={2}>Vendedor</option>
              </select>
            </div>
            <Button type="submit" className="w-full" disabled={cargando}>{cargando ? 'Registrando...' : 'Crear cuenta'}</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            ¿Ya tienes cuenta? <Link to="/login" className="text-primary hover:underline">Inicia sesión</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaginaRegistro;
