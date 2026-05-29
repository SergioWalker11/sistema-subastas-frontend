import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../contextos/ContextoUsuario';
import { obtenerSubastas, crearSubasta } from '../api/clienteApi';
import { obtenerProductos, crearProducto } from '../api/clienteApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../componentes/ui/Card';
import { Button } from '../componentes/ui/Button';
import { Input, Label } from '../componentes/ui/Input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../componentes/ui/Tabs';

function PaginaCrearProducto() {
  const { usuario } = useUsuario();
  const navigate = useNavigate();

  const [productoNombre, setProductoNombre] = useState('');
  const [productoDesc, setProductoDesc] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [precioInicial, setPrecioInicial] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState('');
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    tryLoad();
  }, []);

  const tryLoad = async () => {
    try {
      const r = await obtenerProductos();
      setProductos(r.datos || []);
      const c = await (await fetch((import.meta.env.VITE_API_URL || 'http://localhost:5221/api') + '/productos/categorias')).json();
      setCategorias(c.datos || []);
    } catch { }
  };

  const handleCrearProductoYSubasta = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      const r = await crearProducto({ nombre: productoNombre, descripcion: productoDesc, categoriaId: categoriaId ? parseInt(categoriaId) : null });
      const pid = r.datos.id;
      await crearSubasta({ productoId: pid, vendedorId: usuario.id, precioInicial: parseFloat(precioInicial), fechaInicio: new Date(fechaInicio).toISOString(), fechaFin: new Date(fechaFin).toISOString() });
      navigate('/mis-subastas');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear');
    } finally {
      setCargando(false);
    }
  };

  const handleSubastaExistente = async (e) => {
    e.preventDefault();
    if (!productoId) return;
    setCargando(true); setError('');
    try {
      await crearSubasta({ productoId: parseInt(productoId), vendedorId: usuario.id, precioInicial: parseFloat(precioInicial), fechaInicio: new Date(fechaInicio).toISOString(), fechaFin: new Date(fechaFin).toISOString() });
      navigate('/mis-subastas');
    } catch (err) {
      setError(err.response?.data?.mensaje || 'Error al crear');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Crear nueva subasta</h1>
      {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md mb-4">{error}</div>}
      <Tabs defaultValue="nuevo">
        <TabsList className="w-full">
          <TabsTrigger value="nuevo" className="flex-1">Nuevo producto</TabsTrigger>
          <TabsTrigger value="existente" className="flex-1">Producto existente</TabsTrigger>
        </TabsList>
        <TabsContent value="nuevo">
          <Card>
            <CardHeader><CardTitle>Producto + Subasta</CardTitle><CardDescription>Crea el producto y la subasta en un paso</CardDescription></CardHeader>
            <CardContent>
              <form onSubmit={handleCrearProductoYSubasta} className="space-y-4">
                <div><Label>Nombre del producto</Label><Input value={productoNombre} onChange={e => setProductoNombre(e.target.value)} required /></div>
                <div><Label>Descripción</Label><Input value={productoDesc} onChange={e => setProductoDesc(e.target.value)} /></div>
                <div>
                  <Label>Categoría</Label>
                  <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                    <option value="">Sin categoría</option>
                    {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                  </select>
                </div>
                <div><Label>Precio inicial (Bs)</Label><Input type="number" step="0.01" value={precioInicial} onChange={e => setPrecioInicial(e.target.value)} placeholder="500.00" required /></div>
                <div><Label>Fecha inicio</Label><Input type="datetime-local" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} required /></div>
                <div><Label>Fecha fin</Label><Input type="datetime-local" value={fechaFin} onChange={e => setFechaFin(e.target.value)} required /></div>
                <Button type="submit" className="w-full" disabled={cargando}>{cargando ? 'Creando...' : 'Crear producto y subasta'}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="existente">
          <Card>
            <CardHeader><CardTitle>Usar producto existente</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubastaExistente} className="space-y-4">
                <div>
                  <Label>Producto</Label>
                  <select value={productoId} onChange={e => setProductoId(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" required>
                    <option value="">Seleccionar producto</option>
                    {productos.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
                <div><Label>Precio inicial (Bs)</Label><Input type="number" step="0.01" value={precioInicial} onChange={e => setPrecioInicial(e.target.value)} required /></div>
                <div><Label>Fecha inicio</Label><Input type="datetime-local" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} required /></div>
                <div><Label>Fecha fin</Label><Input type="datetime-local" value={fechaFin} onChange={e => setFechaFin(e.target.value)} required /></div>
                <Button type="submit" className="w-full" disabled={cargando}>{cargando ? 'Creando...' : 'Crear subasta'}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PaginaCrearProducto;
