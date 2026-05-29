import { useState, useCallback, useEffect } from 'react';

export function useApi(fn, deps = []) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const ejecutar = useCallback(async () => {
    setCargando(true);
    setError('');
    try {
      const r = await fn();
      setDatos(r.datos || r.data || r);
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al cargar datos');
    } finally {
      setCargando(false);
    }
  }, deps);

  useEffect(() => { ejecutar(); }, [ejecutar]);

  return { datos, cargando, error, recargar: ejecutar };
}

export function useMutacion(fn) {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const ejecutar = async (...args) => {
    setCargando(true);
    setError('');
    setExito('');
    try {
      const r = await fn(...args);
      setExito(r.mensaje || 'Operacion exitosa');
      return r.datos || r;
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error en la operacion');
      throw err;
    } finally {
      setCargando(false);
    }
  };

  return { ejecutar, cargando, error, exito, setError, setExito };
}
