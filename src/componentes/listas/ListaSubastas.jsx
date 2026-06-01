import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerSubastas, obtenerCategorias } from '../../api/clienteApi';
import { useUsuario } from '../../contextos/ContextoUsuario';
import { Card, CardContent } from '../ui/Tarjeta';
import { Badge } from '../ui/Insignia';
import { Button } from '../ui/Boton';
import { Input } from '../ui/Entrada';
import Cargador from '../ui/Cargador';
import EstadoVacio from '../ui/EstadoVacio';
import { ESTADO_MAPA, ESTADO_VARIANTE } from '../../utilidades/constantes';
import { formatearMoneda } from '../../utilidades/formatearMoneda';
import { Search, SlidersHorizontal, X, ImageOff } from 'lucide-react';

const ESTADOS_PUBLICOS = ['activa', 'vendida'];
const BASE_IMAGENES = 'http://localhost:5221';

function ListaSubastas({ soloActivas = false, limite }) {
  const { usuario } = useUsuario();
  const [todas, setTodas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState(soloActivas ? 'activa' : 'todas');
  const [categoriaFiltro, setCategoriaFiltro] = useState('todas');
  const [precioMin, setPrecioMin] = useState('');
  const [precioMax, setPrecioMax] = useState('');
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [pagina, setPagina] = useState(1);
  const navigate = useNavigate();
  const ITEMS_POR_PAGINA = limite || 6;

  useEffect(() => {
    Promise.all([obtenerSubastas(), obtenerCategorias()])
      .then(([sub, cat]) => { setTodas(sub.datos || []); setCategorias(cat.datos || []); })
      .catch(() => { })
      .finally(() => setCargando(false));
  }, []);

  useEffect(() => { setPagina(1); }, [busqueda, estadoFiltro, categoriaFiltro, precioMin, precioMax]);

  const subastas = useMemo(() => {
    return todas.filter(s => {
      const t = busqueda.toLowerCase();
      if (t && !(s.nombreProducto || '').toLowerCase().includes(t) && !(s.descripcionProducto || '').toLowerCase().includes(t)) return false;
      if (!usuario) return ESTADOS_PUBLICOS.includes(s.estado) && (estadoFiltro === 'todas' || s.estado === estadoFiltro);
      if (estadoFiltro !== 'todas' && s.estado !== estadoFiltro) return false;
      if (categoriaFiltro !== 'todas' && s.categoriaId !== parseInt(categoriaFiltro)) return false;
      if (precioMin && s.precioActual < parseFloat(precioMin)) return false;
      if (precioMax && s.precioActual > parseFloat(precioMax)) return false;
      return true;
    });
  }, [todas, busqueda, estadoFiltro, categoriaFiltro, precioMin, precioMax, usuario]);

  const total = Math.ceil(subastas.length / ITEMS_POR_PAGINA);
  const pag = subastas.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);

  if (cargando) return <Cargador mensaje="Cargando subastas..." />;

  const estadosVisibles = usuario
    ? [{ k: 'todas', l: 'Todas' }, { k: 'activa', l: 'Activas' }, { k: 'pendiente_pago', l: 'Pendientes' }, { k: 'vendida', l: 'Vendidas' }, { k: 'incumplida', l: 'Incumplidas' }, { k: 'cancelada', l: 'Canceladas' }]
    : [{ k: 'todas', l: 'Todas' }, { k: 'activa', l: 'Activas' }, { k: 'vendida', l: 'Vendidas' }];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar subastas..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="pl-9" />
          </div>
          <Button variant="outline" size="icon" onClick={() => setMostrarFiltros(!mostrarFiltros)} title="Filtros">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-wrap gap-1">
          {estadosVisibles.map(e => (
            <button key={e.k} onClick={() => setEstadoFiltro(e.k)} className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${estadoFiltro === e.k ? 'bg-primary text-primary-foreground border-primary' : 'border-input hover:bg-accent'}`}>{e.l}</button>
          ))}
        </div>

        {mostrarFiltros && (
          <div className="flex flex-wrap items-end gap-3 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1 min-w-[140px]">
              <label className="text-xs text-muted-foreground mb-1 block">Categoria</label>
              <select value={categoriaFiltro} onChange={e => setCategoriaFiltro(e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option value="todas">Todas</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>
            <div className="w-[120px]">
              <label className="text-xs text-muted-foreground mb-1 block">Precio min</label>
              <Input type="number" placeholder="0" value={precioMin} onChange={e => setPrecioMin(e.target.value)} />
            </div>
            <div className="w-[120px]">
              <label className="text-xs text-muted-foreground mb-1 block">Precio max</label>
              <Input type="number" placeholder="999999" value={precioMax} onChange={e => setPrecioMax(e.target.value)} />
            </div>
            {(precioMin || precioMax || categoriaFiltro !== 'todas') && (
              <Button variant="ghost" size="sm" onClick={() => { setPrecioMin(''); setPrecioMax(''); setCategoriaFiltro('todas'); }}><X className="h-3 w-3 mr-1" />Limpiar</Button>
            )}
          </div>
        )}
      </div>

      {pag.length === 0 ? (
        <EstadoVacio mensaje="No se encontraron subastas" />
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pag.map(s => (
              <Card key={s.id} className="hover:shadow-md transition-shadow cursor-pointer overflow-hidden" onClick={() => navigate(`/subasta/${s.id}`)}>
                {s.imagenPrincipal ? (
                  <img src={`${BASE_IMAGENES}/ImagenesProductos/${s.imagenPrincipal}`} alt={s.nombreProducto} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-muted flex items-center justify-center">
                    <ImageOff className="h-8 w-8 text-muted-foreground/40" />
                  </div>
                )}
                <CardContent className="p-4 space-y-3">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="font-semibold text-lg truncate">{s.nombreProducto}</h3>
                    <Badge variant={ESTADO_VARIANTE[s.estado] || 'outline'} className="shrink-0">{ESTADO_MAPA[s.estado] || s.estado}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">{s.descripcionProducto}</p>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-muted-foreground">Precio actual</p>
                      <p className="text-lg font-bold text-primary">{formatearMoneda(s.precioActual)}</p>
                    </div>
                    {s.categoriaNombre && <span className="text-xs bg-muted px-2 py-0.5 rounded">{s.categoriaNombre}</span>}
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{s.cantidadPujas} pujas</span>
                    <span>Fin: {new Date(s.fechaFin).toLocaleDateString()}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {total > 1 && (
            <div className="flex justify-center items-center gap-4 pt-4">
              <Button variant="outline" size="sm" onClick={() => setPagina(p => Math.max(1, p - 1))} disabled={pagina === 1}>Anterior</Button>
              <span className="text-sm text-muted-foreground">Pagina {pagina} de {total}</span>
              <Button variant="outline" size="sm" onClick={() => setPagina(p => Math.min(total, p + 1))} disabled={pagina === total}>Siguiente</Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default ListaSubastas;
