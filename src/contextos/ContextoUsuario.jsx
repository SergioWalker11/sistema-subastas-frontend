import { createContext, useContext, useState, useEffect } from 'react';
import { login, registro } from '../api/clienteApi';

const ContextoUsuario = createContext(null);

export function ProveedorUsuario({ children }) {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const guardado = localStorage.getItem('usuario');
    if (guardado) {
      try { setUsuario(JSON.parse(guardado)); } catch { }
    }
  }, []);

  const iniciarSesion = async (correo, contrasena) => {
    const respuesta = await login({ correo, contrasena });
    const datos = respuesta.datos;
    const u = {
      id: datos.usuarioId, nombre: datos.nombreCompleto, correo: datos.correo, rol: datos.rol, token: datos.token
    };
    localStorage.setItem('token', datos.token);
    localStorage.setItem('usuario', JSON.stringify(u));
    setUsuario(u);
    return u;
  };

  const registrarUsuario = async (nombre, correo, contrasena, rolId) => {
    const respuesta = await registro({ nombreCompleto: nombre, correo, contrasena, rolId });
    const datos = respuesta.datos;
    const u = {
      id: datos.usuarioId, nombre: datos.nombreCompleto, correo: datos.correo, rol: datos.rol, token: datos.token
    };
    localStorage.setItem('token', datos.token);
    localStorage.setItem('usuario', JSON.stringify(u));
    setUsuario(u);
    return u;
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    setUsuario(null);
  };

  return (
    <ContextoUsuario.Provider value={{ usuario, iniciarSesion, registrarUsuario, cerrarSesion }}>
      {children}
    </ContextoUsuario.Provider>
  );
}

export function useUsuario() {
  const ctx = useContext(ContextoUsuario);
  if (!ctx) throw new Error('useUsuario debe usarse dentro de ProveedorUsuario');
  return ctx;
}
