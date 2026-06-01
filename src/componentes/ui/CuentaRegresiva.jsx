import { useState, useEffect } from 'react';
import { Badge } from './Insignia';
import { Clock } from 'lucide-react';

export default function CuentaRegresiva({ endsAt }) {
  const [restante, setRestante] = useState(0);
  const [expirado, setExpirado] = useState(false);
  const [urgente, setUrgente] = useState(false);

  useEffect(() => {
    const tick = () => {
      const r = new Date(endsAt).getTime() - Date.now();
      if (r <= 0) { setRestante(0); setExpirado(true); return; }
      setRestante(r);
      setExpirado(false);
      setUrgente(r < 3600000);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  if (expirado) return <Badge variant="destructive">Finalizada</Badge>;

  const horas = Math.floor(restante / 3600000);
  const minutos = Math.floor((restante % 3600000) / 60000);
  const segundos = Math.floor((restante % 60000) / 1000);

  return (
    <Badge variant={urgente ? 'warning' : 'outline'} className={urgente ? 'animate-pulse' : ''}>
      <Clock className="h-3 w-3 mr-1" />
      {horas > 0 ? `${horas}h ` : ''}{minutos}m {segundos}s
    </Badge>
  );
}
