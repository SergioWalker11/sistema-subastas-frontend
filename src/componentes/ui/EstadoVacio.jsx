import { Card, CardContent } from '../ui/Tarjeta';

export default function EstadoVacio({ mensaje = 'No hay elementos disponibles', icono }) {
  return (
    <Card className="border-dashed">
      <CardContent className="text-center py-12 text-muted-foreground">
        {icono && <div className="mb-3 flex justify-center">{icono}</div>}
        <p>{mensaje}</p>
      </CardContent>
    </Card>
  );
}
