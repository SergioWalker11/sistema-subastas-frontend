import { useState } from 'react';
import { Input, Label } from '../ui/Entrada';
import { Button } from '../ui/Boton';
import { CreditCard, Check, Loader2 } from 'lucide-react';
import { procesarPagoTarjeta } from '../../api/clienteApi';

const detectFranquicia = (num) => {
  const c = num[0];
  if (c === '4') return { name: 'Visa', color: 'text-blue-600' };
  if (c === '5') return { name: 'Mastercard', color: 'text-amber-500' };
  return null;
};

function FormularioPagoTarjeta({ monto, subastaId, usuarioId, onCompletado, onCancelar }) {
  const [numero, setNumero] = useState('');
  const [exp, setExp] = useState('');
  const [cvv, setCvv] = useState('');
  const [titular, setTitular] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [procesando, setProcesando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const formatearNumero = (v) => {
    const n = v.replace(/\D/g, '').slice(0, 16);
    return n.replace(/(\d{4})/g, '$1-').replace(/-$/, '');
  };

  const formatearExp = (v) => {
    const n = v.replace(/\D/g, '').slice(0, 4);
    if (n.length >= 3) return n.slice(0, 2) + '/' + n.slice(2);
    return n;
  };

  const franquicia = detectFranquicia(numero.replace(/-/g, ''));

  const enviar = async (e) => {
    e.preventDefault();
    setError('');

    const tarjeta = numero.replace(/-/g, '');
    if (tarjeta.length !== 16) { setError('Número de tarjeta inválido'); return; }
    if (exp.length !== 5) { setError('Fecha de expiración inválida'); return; }
    if (cvv.length < 3) { setError('CVV inválido'); return; }
    if (!titular.trim()) { setError('Nombre del titular requerido'); return; }

    setProcesando(true);
    setEnviando(true);

    try {
      const res = await procesarPagoTarjeta({ subastaId, usuarioId, monto, numeroTarjeta: tarjeta, fechaExpiracion: exp, cvv, nombreTitular: titular });
      setResultado({ exito: true, datos: res.datos });
    } catch (err) {
      const msg = err.response?.data?.mensaje || 'Error al procesar el pago';
      setResultado({ exito: false, mensaje: msg });
    } finally {
      setProcesando(false);
    }
  };

  if (resultado) {
    return (
      <div className="text-center py-6 space-y-4">
        {resultado.exito ? (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <p className="text-lg font-semibold">Pago aprobado</p>
              <p className="text-sm text-muted-foreground">{resultado.datos?.codigoTransaccion}</p>
              <p className="text-xs text-muted-foreground mt-1">{resultado.datos?.franquicia} terminada en {resultado.datos?.ultimosDigitos}</p>
              {resultado.datos?.estadoPago === 'custodia' && <p className="text-xs text-amber-600 mt-2">El dinero esta en custodia. Se liberara al vendedor en breve.</p>}
            </div>
            <Button onClick={onCompletado}>Ir a inicio</Button>
          </>
        ) : (
          <>
            <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <span className="text-2xl text-red-600">&times;</span>
            </div>
            <p className="text-lg font-semibold text-red-600">Pago rechazado</p>
            <p className="text-sm text-muted-foreground">{resultado.mensaje}</p>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => { setResultado(null); setError(''); setEnviando(false); }}>Intentar de nuevo</Button>
              <Button variant="ghost" onClick={onCancelar}>Cancelar</Button>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {procesando && (
        <div className="fixed inset-0 z-50 bg-background/80 flex items-center justify-center">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-lg font-medium">Procesando pago...</p>
            <p className="text-sm text-muted-foreground">Verificando datos con la pasarela</p>
          </div>
        </div>
      )}
      <form onSubmit={enviar} className="space-y-4">
        {error && <div className="text-sm text-red-600 bg-red-50 dark:bg-red-950/30 p-2 rounded">{error}</div>}

        <div>
          <Label>Número de tarjeta</Label>
          <div className="relative">
            <Input value={numero} onChange={e => setNumero(formatearNumero(e.target.value))} placeholder="0000-0000-0000-0000" maxLength={19} required />
            {franquicia && <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold ${franquicia.color}`}>{franquicia.name}</span>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Vencimiento</Label>
            <Input value={exp} onChange={e => setExp(formatearExp(e.target.value))} placeholder="MM/YY" maxLength={5} required />
          </div>
          <div>
            <Label>CVV</Label>
            <Input value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))} placeholder="123" maxLength={3} type="password" required />
          </div>
        </div>

        <div>
          <Label>Nombre del titular</Label>
          <Input value={titular} onChange={e => setTitular(e.target.value)} placeholder="Como aparece en la tarjeta" required />
        </div>

        <p className="text-lg font-bold text-center">Total: {monto.toLocaleString('es-CO', { style: 'currency', currency: 'COP' })}</p>

        <div className="flex gap-2">
          <Button type="submit" disabled={enviando} className="flex-1" size="lg">
            <CreditCard className="h-4 w-4 mr-2" />Pagar ahora
          </Button>
          <Button type="button" variant="ghost" onClick={onCancelar}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}

export default FormularioPagoTarjeta;
