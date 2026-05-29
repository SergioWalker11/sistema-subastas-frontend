import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerSubastas } from '../../api/clienteApi';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useApi } from '../../hooks/useApi';

function ListaSubastas({ soloActivas = false, limite }) {
  const { datos, cargando, error } = useApi(obtenerSubastas);
  const [busqueda, setBusqueda] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState(soloActivas ? 'activa' : 'todas');
  const [pagina, setPagina] = useState(1);
  const navigate = useNavigate();
  const ITEMS_POR_PAGINA = limite || 6;

  useEffect(() => { setPagina(1); }, [busqueda, estadoFiltro]);

  const subastas = useMemo(() => {
    const lista = datos || [];
    return lista.filter(s => {
      const t = busqueda.toLowerCase();
      return (!t || s.nombreProducto?.toLowerCase().includes(t) || s.descripcionProducto?.toLowerCase().includes(t)) && (estadoFiltro === 'todas' || s.estado === estadoFiltro);
    });
  }, [datos, busqueda, estadoFiltro]);

  const total = Math.ceil(subastas.length / ITEMS_POR_PAGINA);
  const pag = subastas.slice((pagina - 1) * ITEMS_POR_PAGINA, pagina * ITEMS_POR_PAGINA);

  if (cargando) return <p className="text-center py-8 text-muted-foreground">Cargando subastas...</p>;
  if (error) return <p className="text-center py-8 text-destructive">{error}</p>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input placeholder="Buscar subastas..." value={busqueda} onChange={e => setBusqueda(e.target.value)} className="max-w-sm" />
        <div className="flex gap-1">
          {['todas','activa','finalizada'].map(e => (
            <button key={e} onClick={() => setEstadoFiltro(e)} className={`px-3 py-1.5 text-sm rounded-md border transition-colors ${estadoFiltro===e?'bg-primary text-primary-foreground border-primary':'border-input hover:bg-accent'}`}>{e[0].toUpperCase()+e.slice(1)}</button>
          ))}
        </div>
      </div>
      {pag.length===0 ? <p className="text-muted-foreground text-center py-8">No se encontraron subastas</p> : <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {pag.map(s => (
            <Card key={s.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={()=>navigate(`/subasta/${s.id}`)}>
              <CardContent className="p-4 space-y-3">
                <h3 className="font-semibold text-lg truncate">{s.nombreProducto}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{s.descripcionProducto}</p>
                <div className="flex justify-between items-center">
                  <div><p className="text-xs text-muted-foreground">Precio actual</p><p className="text-lg font-bold text-primary">Bs {s.precioActual?.toFixed(2)}</p></div>
                  <Badge variant={s.estado==='activa'?'success':'secondary'}>{s.estado}</Badge>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground"><span>{s.cantidadPujas} pujas</span><span>Fin: {new Date(s.fechaFin).toLocaleDateString()}</span></div>
              </CardContent>
            </Card>
          ))}
        </div>
        {total>1 && <div className="flex justify-center items-center gap-4 pt-4">
          <Button variant="outline" size="sm" onClick={()=>setPagina(p=>Math.max(1,p-1))} disabled={pagina===1}>Anterior</Button>
          <span className="text-sm text-muted-foreground">Página {pagina} de {total}</span>
          <Button variant="outline" size="sm" onClick={()=>setPagina(p=>Math.min(total,p+1))} disabled={pagina===total}>Siguiente</Button>
        </div>}
      </>}
    </div>
  );
}

export default ListaSubastas;
