import { Toaster as SonnerToaster, toast } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      richColors
      closeButton
      duration={4000}
      toastOptions={{
        style: {
          fontFamily: "'Inter', system-ui, sans-serif",
          fontSize: '14px',
        },
      }}
    />
  );
}

export const toastExito = (mensaje) => toast.success(mensaje);
export const toastError = (mensaje) => toast.error(mensaje);
export const toastAviso = (mensaje) => toast.warning(mensaje);
