import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';

const DecisionSolicitud = () => {
  const { idSolicitud } = useParams();
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (rol !== 'ADMIN') {
      navigate('/');
      return;
    }
    cargarSolicitud();
  }, [idSolicitud, navigate]);

  const cargarSolicitud = async () => {
    try {
      const response = await fetch(`/api/solicitudes/${idSolicitud}`);
      if (response.ok) {
        const data = await response.json();
        setSolicitud(data);
      } else {
        setError('Solicitud no encontrada');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const tomarDecision = async (decision) => {
    if (!window.confirm(`¿Estás seguro de ${decision.toLowerCase()} esta solicitud?`)) {
      return;
    }

    setLoading(true);
    setError('');

    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) {
      setError('Debes iniciar sesión');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/solicitudes/${idSolicitud}/decision`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUsuario: parseInt(idUsuario),
          estadoSolicitud: decision.toUpperCase(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Solicitud ${decision.toLowerCase()} exitosamente`);
        navigate('/listar-solicitudes');
      } else {
        setError(typeof data === 'string' ? data : (data.message || 'Error al procesar la decisión'));
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (error && !solicitud) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="ADMIN" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-red-600 text-xl">{error}</p>
            <Button onClick={() => navigate('/listar-solicitudes')} className="mt-4">
              Volver a Solicitudes
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (!solicitud) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#22C55E] text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="ADMIN" />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex gap-3">
          <Button variant="outline" onClick={() => navigate(`/ver-solicitud/${idSolicitud}`)}>
            <i className="fas fa-arrow-left mr-2"></i>Volver a Solicitud
          </Button>
          <Button variant="outline" onClick={() => navigate('/dashboard-admin')}>
            <i className="fas fa-home mr-2"></i>Dashboard
          </Button>
        </div>

        <Card className="p-8">
          <h1 className="text-3xl font-semibold text-gray-800 mb-6">Tomar Decisión</h1>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Solicitud #{solicitud.idSolicitud}</h2>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              <p><span className="font-medium">Mascota:</span> {solicitud.mascotaSolicitada?.nombre || solicitud.mascota?.nombre || 'N/A'}</p>
              <p><span className="font-medium">Adoptante:</span> {solicitud.usuarioAdoptante?.nombreCompleto || solicitud.adoptante?.nombre || 'N/A'}</p>
              {solicitud.mensajeAdoptante && (
                <p className="text-sm text-gray-600 mt-2">"{solicitud.mensajeAdoptante}"</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Button
              variant="primary"
              size="lg"
              className="w-full"
              onClick={() => tomarDecision('ACEPTADA')}
              disabled={loading || solicitud.estadoSolicitud !== 'PENDIENTE'}
            >
              <i className="fas fa-check mr-2"></i>
              {loading ? 'Procesando...' : 'Aceptar Solicitud'}
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full border-red-300 text-red-600 hover:bg-red-50"
              onClick={() => tomarDecision('RECHAZADA')}
              disabled={loading || solicitud.estadoSolicitud !== 'PENDIENTE'}
            >
              <i className="fas fa-times mr-2"></i>
              {loading ? 'Procesando...' : 'Rechazar Solicitud'}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() => navigate('/listar-solicitudes')}
            >
              <i className="fas fa-arrow-left mr-2"></i>Cancelar
            </Button>
          </div>

          {solicitud.estadoSolicitud !== 'PENDIENTE' && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm">
              Esta solicitud ya ha sido procesada.
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default DecisionSolicitud;

