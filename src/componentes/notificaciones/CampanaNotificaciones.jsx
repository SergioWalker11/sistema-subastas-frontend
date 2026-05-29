import { useState, useEffect, useRef } from 'react';
import { obtenerNotificaciones, marcarNotificacionLeida, contarNotificacionesNoLeidas } from '../../api/clienteApi';
import { useUsuario } from '../../contextos/ContextoUsuario';
import { Bell } from 'lucide-react';

function CampanaNotificaciones() {
  const { usuario } = useUsuario();
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [mostrar, setMostrar] = useState(false);
  const ref = useRef(null);

  useEffect(() => { if(!usuario)return; cargar(); const i=setInterval(cargar,30000); return ()=>clearInterval(i); }, [usuario?.id]);
  useEffect(() => { const h=e=>{if(ref.current&&!ref.current.contains(e.target))setMostrar(false)}; document.addEventListener('mousedown',h); return ()=>document.removeEventListener('mousedown',h); }, []);

  const cargar = async () => {
    try { const [r1,r2]=await Promise.all([obtenerNotificaciones(usuario.id), contarNotificacionesNoLeidas(usuario.id)]); setNotificaciones(r1.datos||[]); setNoLeidas(r2.datos?.cantidad||0); } catch {}
  };

  const marcar = async (id) => { await marcarNotificacionLeida(id); setNoLeidas(p=>Math.max(0,p-1)); cargar(); };

  if(!usuario) return null;

  return (
    <div className="relative" ref={ref}>
      <button onClick={()=>setMostrar(!mostrar)} className="relative p-2 rounded-md hover:bg-accent transition-colors" aria-label="Notificaciones">
        <Bell className="h-5 w-5" />
        {noLeidas>0 && <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">{noLeidas>9?'9+':noLeidas}</span>}
      </button>
      {mostrar && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b font-medium text-sm">Notificaciones</div>
          {notificaciones.length===0 ? <p className="p-4 text-sm text-muted-foreground text-center">Sin notificaciones</p> : notificaciones.map(n=>(
            <div key={n.id} onClick={()=>!n.leida&&marcar(n.id)} className={`p-3 border-b last:border-0 cursor-pointer transition-colors hover:bg-accent ${!n.leida?'bg-primary/5':''}`}>
              <p className="text-sm font-medium">{n.titulo}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{n.mensaje}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{new Date(n.fechaCreacion).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CampanaNotificaciones;
