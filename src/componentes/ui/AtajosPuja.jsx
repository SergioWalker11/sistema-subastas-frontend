import { Button } from './Boton';
import { formatearMoneda } from '../../utilidades/formatearMoneda';

export default function AtajosPuja({ precioMinimo, onSelect }) {
  const shortcuts = [
    { label: '+10', amount: precioMinimo + 9 },
    { label: '+50', amount: precioMinimo + 49 },
    { label: '+100', amount: precioMinimo + 99 },
    { label: `Mín`, amount: precioMinimo },
  ];

  return (
    <div className="flex flex-wrap gap-1.5">
      {shortcuts.map(s => (
        <Button
          key={s.label}
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onSelect(s.amount)}
          className="text-xs h-7"
        >
          {s.label === 'Mín' ? `${s.label} ${formatearMoneda(s.amount)}` : `${s.label}`}
        </Button>
      ))}
    </div>
  );
}
