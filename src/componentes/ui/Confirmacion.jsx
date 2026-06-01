import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './Modal';
import { Button } from './Boton';

export default function Confirmacion({ open, onOpenChange, title, description, confirmText = 'Confirmar', cancelText = 'Cancelar', variant = 'default', onConfirm }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>{cancelText}</Button>
          <Button variant={variant === 'destructive' ? 'destructive' : 'default'} onClick={() => { onConfirm(); onOpenChange(false); }}>{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
