import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearDenuncia } from '../api/clienteApi';
import { Card, CardContent, CardHeader, CardTitle } from '../componentes/ui/Tarjeta';
import { Button } from '../componentes/ui/Boton';
import { Input } from '../componentes/ui/Entrada';
import { Badge } from '../componentes/ui/Insignia';
import { toastExito, toastError } from '../componentes/ui/NotificacionToast';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

function PaginaCrearDenuncia() {
  const navigate = useNavigate();
  const [motivo, setMotivo] = useState('');
  const [enviando, setEnviando] = useState(false);
  const denunciadoId = new URLSearchParams(window.location.search).get('denunciadoId');
  const denunciadoNombre = new URLSearchParams(window.location.search).get('denunciadoNombre') || 'Usuario';

  const enviar = async (e) => {
    e.preventDefault();
    if (!motivo.trim()) return toastError('Escribe el motivo de la denuncia');
    setEnviando(true);
    try {
      await crearDenuncia({ denunciadoId: parseInt(denunciadoId), motivo });
      toastExito('Denuncia enviada');
      navigate('/');
    } catch (err) {
      toastError(err.response?.data?.mensaje || 'Error al enviar denuncia');
    } finally { setEnviando(false); }
  };

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)}><ArrowLeft className="h-4 w-4 mr-1" />Volver</Button>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-amber-500" />Denunciar a {denunciadoNombre}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={enviar} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">Motivo de la denuncia</label>
              <textarea
                value={motivo}
                onChange={e => setMotivo(e.target.value)}
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[120px] resize-y"
                placeholder="Describe por que estas denunciando a este usuario..."
                required
              />
            </div>
            <Button type="submit" disabled={enviando} className="w-full">{enviando ? 'Enviando...' : 'Enviar denuncia'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default PaginaCrearDenuncia;
