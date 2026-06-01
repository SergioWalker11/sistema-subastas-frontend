import { useState, useEffect } from 'react';
import { Badge } from './Insignia';
import { Clock } from 'lucide-react';

export default function TiempoRestante({ fechaLimite }) {
  const [ahora, setAhora] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setAhora(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  const restante = new Date(fechaLimite).getTime() - ahora;
  if (restante <= 0) return <Badge variant="destructive">Vencido</Badge>;

  const horas = Math.floor(restante / 3600000);
  const minutos = Math.floor((restante % 3600000) / 60000);
  return <Badge variant="outline"><Clock className="h-3 w-3 mr-1" />{horas}h {minutos}m</Badge>;
}
