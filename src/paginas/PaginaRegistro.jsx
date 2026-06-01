import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUsuario } from '../contextos/ContextoUsuario';
import PlantillaAutenticacion from '../componentes/plantillas/PlantillaAutenticacion';
import { Button } from '../componentes/ui/Boton';
import { Input } from '../componentes/ui/Entrada';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../componentes/ui/Selector';
import CampoFormulario from '../componentes/ui/CampoFormulario';
import AlertaError from '../componentes/ui/AlertaError';

function PaginaRegistro() {
  const { registrarUsuario } = useUsuario();
  const navigate = useNavigate();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [rolId, setRolId] = useState('');
  const [errores, setErrores] = useState({});
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const validar = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = 'El nombre es obligatorio';
    if (!correo.trim()) e.correo = 'El correo es obligatorio';
    else if (!/\S+@\S+\.\S+/.test(correo)) e.correo = 'El formato del correo no es valido';
    if (!contrasena) e.contrasena = 'La contrasena es obligatoria';
    else if (contrasena.length < 6) e.contrasena = 'Minimo 6 caracteres';
    if (!confirmar) e.confirmar = 'Confirma tu contrasena';
    else if (confirmar !== contrasena) e.confirmar = 'Las contrasenas no coinciden';
    if (!rolId) e.rolId = 'Selecciona un tipo de cuenta';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validar()) return;
    setError('');
    setCargando(true);
    try {
      await registrarUsuario(nombre, correo, contrasena, parseInt(rolId));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al registrarse');
    } finally {
      setCargando(false);
    }
  };

  return (
    <PlantillaAutenticacion title="Crear Cuenta" subtitle="Unete a la comunidad de subastas">
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <AlertaError mensaje={error} cerrar={() => setError('')} />}
        <CampoFormulario label="Nombre completo" htmlFor="nombre" required error={errores.nombre}>
          <Input id="nombre" value={nombre} onChange={e => { setNombre(e.target.value); if (errores.nombre) setErrores(p => ({ ...p, nombre: '' })); }} placeholder="Tu nombre completo" />
        </CampoFormulario>
        <CampoFormulario label="Correo electronico" htmlFor="correo" required error={errores.correo}>
          <Input id="correo" type="email" value={correo} onChange={e => { setCorreo(e.target.value); if (errores.correo) setErrores(p => ({ ...p, correo: '' })); }} placeholder="tu@correo.com" autoComplete="email" />
        </CampoFormulario>
        <CampoFormulario label="Contrasena" htmlFor="contrasena" required error={errores.contrasena}>
          <Input id="contrasena" type="password" value={contrasena} onChange={e => { setContrasena(e.target.value); if (errores.contrasena) setErrores(p => ({ ...p, contrasena: '' })); }} placeholder="Minimo 6 caracteres" autoComplete="new-password" />
        </CampoFormulario>
        <CampoFormulario label="Confirmar contrasena" htmlFor="confirmar" required error={errores.confirmar}>
          <Input id="confirmar" type="password" value={confirmar} onChange={e => { setConfirmar(e.target.value); if (errores.confirmar) setErrores(p => ({ ...p, confirmar: '' })); }} placeholder="Repite tu contrasena" autoComplete="new-password" />
        </CampoFormulario>
        <CampoFormulario label="Tipo de cuenta" htmlFor="rol" required error={errores.rolId} hint="Comprador: puedes pujar en subastas. Vendedor: puedes crear y gestionar subastas.">
          <Select value={rolId} onValueChange={v => { setRolId(v); if (errores.rolId) setErrores(p => ({ ...p, rolId: '' })); }}>
            <SelectTrigger id="rol"><SelectValue placeholder="Selecciona un tipo de cuenta" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="3">Comprador</SelectItem>
              <SelectItem value="2">Vendedor</SelectItem>
            </SelectContent>
          </Select>
        </CampoFormulario>
        <Button type="submit" className="w-full" size="lg" disabled={cargando}>{cargando ? 'Creando cuenta...' : 'Crear cuenta'}</Button>
      </form>
      <p className="text-center text-sm text-muted-foreground">
        Ya tienes cuenta?{' '}
        <Link to="/login" className="text-primary font-medium hover:underline">Inicia sesion</Link>
      </p>
    </PlantillaAutenticacion>
  );
}

export default PaginaRegistro;
