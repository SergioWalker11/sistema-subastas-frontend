export default function Cargador({ mensaje = 'Cargando...' }) {
  return (
    <div role="status" aria-live="polite" className="flex flex-col items-center justify-center py-12 gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">{mensaje}</p>
    </div>
  );
}
