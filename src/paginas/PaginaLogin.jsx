import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsuario } from '../contextos/ContextoUsuario';
import PlantillaAutenticacion from '../componentes/plantillas/PlantillaAutenticacion';
import { Button } from '../componentes/ui/Boton';
import { Input, Label } from '../componentes/ui/Entrada';
import CampoFormulario from '../componentes/ui/CampoFormulario';
import AlertaError from '../componentes/ui/AlertaError';

function PaginaLogin() {
  const { iniciarSesion } = useUsuario();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const validar = () => {
    if (!correo.trim()) return 'El correo es obligatorio';
    if (!/\S+@\S+\.\S+/.test(correo)) return 'El formato del correo no es valido';
    if (!contrasena) return 'La contrasena es obligatoria';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validar();
    if (v) { setError(v); return; }
    setError('');
    setCargando(true);
    try {
      await iniciarSesion(correo, contrasena);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al iniciar sesion');
    } finally {
      setCargando(false);
    }
  };

  return (
    <PlantillaAutenticacion title="Iniciar Sesión" subtitle="Bienvenido de vuelta a SubastasOnline">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <AlertaError mensaje={error} cerrar={() => setError('')} />}
        <CampoFormulario label="Correo electronico" htmlFor="correo" required>
          <Input id="correo" type="email" value={correo} onChange={e => setCorreo(e.target.value)} placeholder="tu@correo.com" autoComplete="email" autoFocus />
        </CampoFormulario>
        <CampoFormulario label="Contrasena" htmlFor="contrasena" required>
          <Input id="contrasena" type="password" value={contrasena} onChange={e => setContrasena(e.target.value)} placeholder="Tu contrasena" autoComplete="current-password" />
        </CampoFormulario>
        <Button type="submit" className="w-full" size="lg" disabled={cargando}>{cargando ? 'Iniciando sesion...' : 'Ingresar'}</Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        No tienes cuenta?{' '}
        <Link to="/registro" className="text-primary font-medium hover:underline">Registrate aqui</Link>
      </p>
    </PlantillaAutenticacion>
  );
}

export default PaginaLogin;
