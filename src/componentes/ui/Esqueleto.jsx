import { cn } from '../../lib/utils';

function Esqueleto({ className, ...props }) {
  return <div className={cn('animate-pulse rounded-md bg-muted', className)} {...props} />;
}

export default Esqueleto;
export { Esqueleto };

export function EsqueletoTexto({ lineas = 1, className }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lineas }).map((_, i) => (
        <Esqueleto key={i} className="h-4 w-full" style={{ width: `${80 + Math.random() * 20}%` }} />
      ))}
    </div>
  );
}

export function EsqueletoTarjeta() {
  return (
    <div className="rounded-lg border bg-card p-4 space-y-3">
      <Esqueleto className="h-5 w-3/4" />
      <Esqueleto className="h-4 w-full" />
      <Esqueleto className="h-4 w-5/6" />
      <div className="flex justify-between pt-2">
        <Esqueleto className="h-8 w-24" />
        <Esqueleto className="h-6 w-16 rounded-full" />
      </div>
    </div>
  );
}

export function EsqueletoGrilla({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <EsqueletoTarjeta key={i} />
      ))}
    </div>
  );
}
