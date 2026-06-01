import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUsuario } from '../contextos/ContextoUsuario';
import { crearSubasta, obtenerProductos, crearProducto, obtenerCategorias, subirImagen } from '../api/clienteApi';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../componentes/ui/Tarjeta';
import { Button } from '../componentes/ui/Boton';
import { Input } from '../componentes/ui/Entrada';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../componentes/ui/Selector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../componentes/ui/Pestanias';
import CampoFormulario from '../componentes/ui/CampoFormulario';
import AlertaError from '../componentes/ui/AlertaError';
import { toastExito, toastError } from '../componentes/ui/NotificacionToast';
import { Upload, X, Image as IconoImagen } from 'lucide-react';

function PaginaCrearProducto() {
  const { usuario } = useUsuario();
  const navigate = useNavigate();

  const [productoNombre, setProductoNombre] = useState('');
  const [productoDesc, setProductoDesc] = useState('');
  const [categoriaId, setCategoriaId] = useState('nada');
  const [precioInicial, setPrecioInicial] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [errores, setErrores] = useState({});
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState('nada');
  const [categorias, setCategorias] = useState([]);
  const [imagenes, setImagenes] = useState([]);
  const [productoCreadoId, setProductoCreadoId] = useState(null);
  const [subiendoImagenes, setSubiendoImagenes] = useState(false);
  const refArchivo = useRef(null);

  useEffect(() => { cargarOpciones(); }, []);

  const cargarOpciones = async () => {
    try {
      const r = await obtenerProductos();
      setProductos(r.datos || []);
      const c = await obtenerCategorias();
      setCategorias(c.datos || []);
    } catch { }
  };

  const manejarArchivos = (e) => {
    const archivos = Array.from(e.target.files);
    const nuevas = archivos.map((a, i) => ({
      id: Date.now() + i,
      archivo: a,
      nombre: a.name,
      esPrincipal: imagenes.length === 0 && i === 0
    }));
    setImagenes(p => [...p, ...nuevas]);
    e.target.value = '';
  };

  const quitarImagen = (id) => {
    setImagenes(p => {
      const filtradas = p.filter(im => im.id !== id);
      if (filtradas.length > 0 && !filtradas.some(im => im.esPrincipal)) {
        filtradas[0].esPrincipal = true;
      }
      return filtradas;
    });
  };

  const subirImagenes = async (productoId) => {
    if (imagenes.length === 0) return;
    setSubiendoImagenes(true);
    try {
      for (const img of imagenes) {
        await subirImagen(productoId, img.archivo, img.esPrincipal);
      }
      toastExito(`${imagenes.length} imagen(es) subida(s)`);
    } catch {
      toastError('Error al subir alguna imagen');
    } finally {
      setSubiendoImagenes(false);
    }
  };

  const validarComun = () => {
    const e = {};
    if (!precioInicial || parseFloat(precioInicial) <= 0) e.precioInicial = 'El precio debe ser mayor a cero';
    if (!fechaInicio) e.fechaInicio = 'La fecha de inicio es obligatoria';
    if (!fechaFin) e.fechaFin = 'La fecha de fin es obligatoria';
    else if (fechaInicio && new Date(fechaFin) <= new Date(fechaInicio)) e.fechaFin = 'La fecha de fin debe ser posterior al inicio';
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const handleCrearProductoYSubasta = async (e) => {
    e.preventDefault();
    const eCampos = {};
    if (!productoNombre.trim()) eCampos.nombre = 'El nombre es obligatorio';
    else if (productoNombre.trim().length < 3) eCampos.nombre = 'Minimo 3 caracteres';
    if (!validarComun()) return;
    setErrores(p => ({ ...p, ...eCampos }));
    if (Object.keys(eCampos).length > 0) return;

    setError(''); setCargando(true);
    try {
      const r = await crearProducto({ nombre: productoNombre, descripcion: productoDesc, categoriaId: categoriaId !== 'nada' ? parseInt(categoriaId) : null });
      const pid = r.datos.id;
      await subirImagenes(pid);
      await crearSubasta({ productoId: pid, vendedorId: usuario.id, precioInicial: parseFloat(precioInicial), fechaInicio: new Date(fechaInicio).toISOString(), fechaFin: new Date(fechaFin).toISOString() });
      toastExito('Subasta creada exitosamente');
      navigate('/mis-subastas');
    } catch (err) { toastError(err.response?.data?.mensaje || 'Error al crear'); }
    finally { setCargando(false); }
  };

  const handleSubastaExistente = async (e) => {
    e.preventDefault();
    const eCampos = {};
    if (productoId === 'nada') eCampos.productoId = 'Selecciona un producto';
    if (!validarComun()) return;
    setErrores(p => ({ ...p, ...eCampos }));
    if (Object.keys(eCampos).length > 0) return;

    setCargando(true); setError('');
    try {
      await crearSubasta({ productoId: parseInt(productoId), vendedorId: usuario.id, precioInicial: parseFloat(precioInicial), fechaInicio: new Date(fechaInicio).toISOString(), fechaFin: new Date(fechaFin).toISOString() });
      toastExito('Subasta creada exitosamente');
      navigate('/mis-subastas');
    } catch (err) { toastError(err.response?.data?.mensaje || 'Error al crear'); }
    finally { setCargando(false); }
  };

  return (
    <div className="max-w-lg mx-auto page-enter">
      <h1 className="text-2xl font-bold mb-2">Crear nueva subasta</h1>
      <p className="text-sm text-muted-foreground mb-6">Completa los datos para publicar tu subasta</p>
      {error && <AlertaError mensaje={error} cerrar={() => setError('')} />}

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
                <CampoFormulario label="Nombre del producto" htmlFor="nombre" required error={errores.nombre}>
                  <Input id="nombre" value={productoNombre} onChange={e => setProductoNombre(e.target.value)} placeholder="Ej: iPhone 14 Pro Max" />
                </CampoFormulario>
                <CampoFormulario label="Descripcion" htmlFor="desc">
                  <Input id="desc" value={productoDesc} onChange={e => setProductoDesc(e.target.value)} placeholder="Describe el producto" />
                </CampoFormulario>
                <CampoFormulario label="Categoria" htmlFor="cat">
                  <Select value={categoriaId} onValueChange={setCategoriaId}>
                    <SelectTrigger id="cat"><SelectValue placeholder="Sin categoria" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nada">Sin categoria</SelectItem>
                      {categorias.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.nombre}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </CampoFormulario>
                <CampoFormulario label="Imagenes del producto" htmlFor="imagenes">
                  <div className="space-y-3">
                    <input ref={refArchivo} id="imagenes" type="file" accept="image/*" multiple onChange={manejarArchivos} className="hidden" />
                    <Button type="button" variant="outline" size="sm" onClick={() => refArchivo.current?.click()}>
                      <Upload className="h-4 w-4 mr-1" />Agregar imagenes
                    </Button>
                    {imagenes.length > 0 && (
                      <div className="grid grid-cols-3 gap-2">
                        {imagenes.map((img) => (
                          <div key={img.id} className={`relative rounded-lg border-2 overflow-hidden ${img.esPrincipal ? 'border-primary' : 'border-muted'}`}>
                            <img src={URL.createObjectURL(img.archivo)} alt={img.nombre} className="w-full h-20 object-cover" />
                            <button type="button" onClick={() => quitarImagen(img.id)} className="absolute top-0.5 right-0.5 bg-destructive text-destructive-foreground rounded-full p-0.5">
                              <X className="h-3 w-3" />
                            </button>
                            {img.esPrincipal && <span className="absolute bottom-0 left-0 right-0 bg-primary text-primary-foreground text-[9px] text-center py-0.5">Principal</span>}
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground">La primera imagen sera la principal. Formatos: JPG, PNG, WebP.</p>
                  </div>
                </CampoFormulario>
                <CampoFormulario label="Precio inicial (Bs)" htmlFor="precio" required error={errores.precioInicial}>
                  <Input id="precio" type="number" step="0.01" value={precioInicial} onChange={e => setPrecioInicial(e.target.value)} placeholder="500.00" />
                </CampoFormulario>
                <CampoFormulario label="Fecha inicio" htmlFor="finicio" required error={errores.fechaInicio}>
                  <Input id="finicio" type="datetime-local" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                </CampoFormulario>
                <CampoFormulario label="Fecha fin" htmlFor="ffin" required error={errores.fechaFin}>
                  <Input id="ffin" type="datetime-local" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                </CampoFormulario>
                <Button type="submit" className="w-full" size="lg" disabled={cargando || subiendoImagenes}>
                  {cargando ? 'Creando...' : 'Crear producto y subasta'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="existente">
          <Card>
            <CardHeader><CardTitle>Usar producto existente</CardTitle></CardHeader>
            <CardContent>
              <form onSubmit={handleSubastaExistente} className="space-y-4">
                <CampoFormulario label="Producto" htmlFor="prod" required error={errores.productoId}>
                  <Select value={productoId} onValueChange={setProductoId}>
                    <SelectTrigger id="prod"><SelectValue placeholder="Seleccionar producto" /></SelectTrigger>
                    <SelectContent>
                      {productos.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.nombre}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </CampoFormulario>
                <CampoFormulario label="Precio inicial (Bs)" htmlFor="precio2" required error={errores.precioInicial}>
                  <Input id="precio2" type="number" step="0.01" value={precioInicial} onChange={e => setPrecioInicial(e.target.value)} />
                </CampoFormulario>
                <CampoFormulario label="Fecha inicio" htmlFor="finicio2" required error={errores.fechaInicio}>
                  <Input id="finicio2" type="datetime-local" value={fechaInicio} onChange={e => setFechaInicio(e.target.value)} />
                </CampoFormulario>
                <CampoFormulario label="Fecha fin" htmlFor="ffin2" required error={errores.fechaFin}>
                  <Input id="ffin2" type="datetime-local" value={fechaFin} onChange={e => setFechaFin(e.target.value)} />
                </CampoFormulario>
                <Button type="submit" className="w-full" size="lg" disabled={cargando}>{cargando ? 'Creando...' : 'Crear subasta'}</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default PaginaCrearProducto;
