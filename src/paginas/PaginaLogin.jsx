import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsuario } from '../contextos/ContextoUsuario';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Card';
import { Button } from '../componentes/ui/Button';
import { Input, Label } from '../componentes/ui/Input';

function PaginaLogin() {
  const { iniciarSesion } = useUsuario();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await iniciarSesion(correo, contrasena);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesión');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-16">
      <Card>
        <CardHeader><CardTitle className="text-center">Iniciar Sesión</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
            <div><Label htmlFor="correo">Correo</Label><Input id="correo" type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="tu@correo.com" required /></div>
            <div><Label htmlFor="contrasena">Contraseña</Label><Input id="contrasena" type="password" value={contrasena} onChange={e => setContrasena(e.target.value)} placeholder="Tu contraseña" required /></div>
            <Button type="submit" className="w-full" disabled={cargando}>{cargando ? 'Iniciando...' : 'Ingresar'}</Button>
          </form>
          <p className="text-center text-sm text-muted-foreground mt-4">
            ¿No tienes cuenta? <Link to="/registro" className="text-primary hover:underline">Regístrate</Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaginaLogin;
