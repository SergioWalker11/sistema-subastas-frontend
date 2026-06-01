import axios from 'axios';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5221/api';

const api = axios.create({
  baseURL: BASE,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(r => r, (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  }
  return Promise.reject(error);
});

export const login = async (d) => (await api.post('/auth/login', d)).data;
export const registro = async (d) => (await api.post('/auth/registro', d)).data;
export const obtenerSubastas = async () => (await api.get('/subastas')).data;
export const obtenerDetalleSubasta = async (id) => (await api.get(`/subastas/${id}`)).data;
export const crearSubasta = async (d) => (await api.post('/subastas', d)).data;
export const obtenerPujasSubasta = async (id, usuarioId) => (await api.get(`/pujas/subasta/${id}`, { params: usuarioId ? { usuarioId } : {} })).data;
export const registrarPuja = async (d) => (await api.post('/pujas', d)).data;
export const procesarPago = async (d) => (await api.post('/pagos', d)).data;
export const procesarPagoTarjeta = async (d) => (await api.post('/pagos/tarjeta', d)).data;
export const obtenerPagosUsuario = async (id) => (await api.get(`/pagos/usuario/${id}`)).data;
export const obtenerNotificaciones = async (id) => (await api.get(`/notificaciones/usuario/${id}`)).data;
export const marcarNotificacionLeida = async (id) => (await api.patch(`/notificaciones/${id}/leida`)).data;
export const contarNotificacionesNoLeidas = async (id) => (await api.get(`/notificaciones/usuario/${id}/no-leidas`)).data;
export const obtenerProductos = async () => (await api.get('/productos')).data;
export const crearProducto = async (d) => (await api.post('/productos', d)).data;
export const obtenerCategorias = async () => (await api.get('/productos/categorias')).data;
export const obtenerSubastasVendedor = async (id) => (await api.get(`/subastas/vendedor/${id}`)).data;
export const obtenerSubastasGanadas = async (id) => (await api.get(`/subastas/ganadas/${id}`)).data;
export const obtenerPendientesPago = async (id) => (await api.get(`/subastas/pendientes-pago/${id}`)).data;
export const obtenerVentas = async (id) => (await api.get(`/subastas/ventas/${id}`)).data;
export const listarUsuarios = async () => (await api.get('/admin/usuarios')).data;
export const cambiarRolUsuario = async (uid, rid) => (await api.patch(`/admin/usuarios/${uid}/rol`, rid, { headers: { 'Content-Type': 'application/json' } })).data;
export const suspenderUsuario = async (uid, suspender) => (await api.patch(`/admin/usuarios/${uid}/suspender`, suspender, { headers: { 'Content-Type': 'application/json' } })).data;
export const cancelarSubasta = async (id, vendedorId) => (await api.patch(`/subastas/${id}/cancelar?vendedorId=${vendedorId}`, {})).data;
export const editarSubasta = async (id, d) => (await api.patch(`/subastas/${id}`, d)).data;
export const crearCategoria = async (d) => (await api.post('/admin/categorias', d)).data;
export const editarCategoria = async (id, d) => (await api.put(`/admin/categorias/${id}`, d)).data;
export const subirImagen = async (productoId, archivo, esPrincipal = false) => {
  const form = new FormData();
  form.append('archivo', archivo);
  const res = await api.post(`/imagenes/${productoId}?esPrincipal=${esPrincipal}`, form, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};
export const obtenerImagenesProducto = async (productoId) => (await api.get(`/imagenes/producto/${productoId}`)).data;
export const obtenerPerfil = async (id) => (await api.get(`/usuarios/${id}`)).data;
export const guardarDatosBancarios = async (id, d) => (await api.put(`/usuarios/${id}/banco`, d)).data;
export const crearDenuncia = async (d) => (await api.post('/denuncias', d)).data;
export const listarDenuncias = async () => (await api.get('/denuncias')).data;
export const resolverDenuncia = async (id, accion) => (await api.patch(`/denuncias/${id}/resolver`, JSON.stringify(accion), { headers: { 'Content-Type': 'application/json' } })).data;
export default api;
