import { ThemeProvider } from 'next-themes';
import { ProveedorUsuario } from './contextos/ContextoUsuario';
import Rutas from './rutas/Rutas';
import { Toaster } from './componentes/ui/NotificacionToast';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <ProveedorUsuario>
        <Rutas />
        <Toaster />
      </ProveedorUsuario>
    </ThemeProvider>
  );
}

export default App;
