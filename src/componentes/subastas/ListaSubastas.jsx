import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { obtenerSubastas } from '../../api/clienteApi';
import TarjetaSubasta from './TarjetaSubasta';
import Cargador from '../comunes/Cargador';
import MensajeAlerta from '../comunes/MensajeAlerta';

function ListaSubastas() {
  const [subastas, setSubastas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => { cargarSubastas(); }, []);

  const cargarSubastas = async () => {
    try {
      const respuesta = await obtenerSubastas();
      // El backend en C# suele serializar las propiedades en camelCase o PascalCase.
      // Usamos respuesta.data (o simplemente repuesta, en caso de otra estructura) 
      setSubastas(respuesta.data || respuesta.datos || respuesta);
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar las subastas');
    }
    finally { setCargando(false); }
  };

  if (cargando) return <Cargador mensaje="Cargando subastas..." />;
  if (error) return <MensajeAlerta tipo="error" mensaje={error} />;

  return (
    <div className="lista-subastas">
      <h1>Subastas disponibles</h1>
      {subastas.length === 0 ? (
        <MensajeAlerta tipo="info" mensaje="No hay subastas disponibles" />
      ) : (
        <div className="lista-subastas-grid">
          {subastas.map((s) => (
            <TarjetaSubasta key={s.id} subasta={s} onClick={() => navigate(`/subasta/${s.id}`)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default ListaSubastas;
