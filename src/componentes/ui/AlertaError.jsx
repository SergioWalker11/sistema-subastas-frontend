export default function AlertaError({ mensaje, cerrar }) {
  return (
    <div role="alert" className="text-sm text-destructive bg-destructive/10 p-3 rounded-md flex items-center justify-between">
      <span>{mensaje}</span>
      {cerrar && (
        <button onClick={cerrar} className="ml-2 text-destructive hover:text-destructive/80" aria-label="Cerrar">&times;</button>
      )}
    </div>
  );
}
