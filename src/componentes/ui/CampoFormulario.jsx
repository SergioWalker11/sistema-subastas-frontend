import { Label } from './Entrada';

export default function CampoFormulario({ label, htmlFor, error, required, hint, className, children }) {
  return (
    <div className={className}>
      <div className="mb-1.5">
        <Label htmlFor={htmlFor}>
          {label}
          {required && <span className="text-destructive ml-0.5">*</span>}
        </Label>
        {hint && <p className="text-xs text-muted-foreground mt-0.5">{hint}</p>}
      </div>
      {children}
      {error && <p className="text-xs text-destructive mt-1 animate-in fade-in slide-in-from-top-1">{error}</p>}
    </div>
  );
}
