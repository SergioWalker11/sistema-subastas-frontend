export default function AlertaExito({ mensaje, cerrar }) {
  return (
    <div role="status" className="text-sm text-success bg-success/10 p-3 rounded-md flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-300">
      <span>{mensaje}</span>
      {cerrar && (
        <button onClick={cerrar} className="ml-2 text-success hover:opacity-80" aria-label="Cerrar">&times;</button>
      )}
    </div>
  );
}
