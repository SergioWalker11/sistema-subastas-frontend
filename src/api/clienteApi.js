import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5221/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

export const obtenerSubastas = async () => {
  const respuesta = await api.get('/subastas');
  return respuesta.data;
};

export const obtenerDetalleSubasta = async (id) => {
  const respuesta = await api.get(`/subastas/${id}`);
  return respuesta.data;
};

export const crearSubasta = async (datos) => {
  const respuesta = await api.post('/subastas', datos);
  return respuesta.data;
};

export const obtenerPujasSubasta = async (subastaId) => {
  const respuesta = await api.get(`/pujas/subasta/${subastaId}`);
  return respuesta.data;
};

export const registrarPuja = async (datos) => {
  const respuesta = await api.post('/pujas', datos);
  return respuesta.data;
};

export const procesarPago = async (datos) => {
  const respuesta = await api.post('/pagos', datos);
  return respuesta.data;
};

export const obtenerPagosUsuario = async (usuarioId) => {
  const respuesta = await api.get(`/pagos/usuario/${usuarioId}`);
  return respuesta.data;
};

export const obtenerNotificaciones = async (usuarioId) => {
  const respuesta = await api.get(`/notificaciones/usuario/${usuarioId}`);
  return respuesta.data;
};

export const marcarNotificacionLeida = async (id) => {
  const respuesta = await api.patch(`/notificaciones/${id}/leida`);
  return respuesta.data;
};

export const contarNotificacionesNoLeidas = async (usuarioId) => {
  const respuesta = await api.get(`/notificaciones/usuario/${usuarioId}/no-leidas`);
  return respuesta.data;
};

export default api;
