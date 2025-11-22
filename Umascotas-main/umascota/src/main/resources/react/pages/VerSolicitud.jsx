import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';

const VerSolicitud = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [solicitud, setSolicitud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (rol !== 'ADMIN') {
      navigate('/');
      return;
    }
    cargarSolicitud();
  }, [id, navigate]);

  const cargarSolicitud = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/solicitudes/${id}`);
      if (response.ok) {
        const data = await response.json();
        setSolicitud(data);
      } else {
        setError('Solicitud no encontrada');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#22C55E] text-xl">Cargando...</div>
      </div>
    );
  }

  if (error || !solicitud) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="ADMIN" />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-red-600 text-xl">{error || 'Solicitud no encontrada'}</p>
            <Button onClick={() => navigate('/listar-solicitudes')} className="mt-4">
              Volver a Solicitudes
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'ACEPTADA':
        return 'bg-green-100 text-green-800';
      case 'RECHAZADA':
        return 'bg-red-100 text-red-800';
      case 'CANCELADA':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const rol = localStorage.getItem('rol');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="ADMIN" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex gap-3">
          <Button variant="outline" onClick={() => navigate('/listar-solicitudes')}>
            <i className="fas fa-arrow-left mr-2"></i>Volver a Solicitudes
          </Button>
          {rol === 'ADMIN' && (
            <Button variant="outline" onClick={() => navigate('/dashboard-admin')}>
              <i className="fas fa-home mr-2"></i>Dashboard
            </Button>
          )}
        </div>

        <Card className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">
              Solicitud #{solicitud.idSolicitud}
            </h1>
            <span
              className={`px-4 py-2 rounded-full text-sm font-medium ${getEstadoColor(
                solicitud.estadoSolicitud
              )}`}
            >
              {solicitud.estadoSolicitud}
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Información de la Mascota</h2>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-800">
                  <span className="font-medium">Nombre:</span> {solicitud.mascotaSolicitada?.nombre || solicitud.mascota?.nombre || 'N/A'}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Especie:</span> {solicitud.mascotaSolicitada?.especie || solicitud.mascota?.especie || 'N/A'}
                </p>
                <p className="text-gray-800">
                  <span className="font-medium">Raza:</span> {solicitud.mascotaSolicitada?.raza || solicitud.mascota?.raza || 'N/A'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate(`/mascota/${solicitud.mascotaSolicitada?.idMascota || solicitud.mascota?.idMascota}`)}
                >
                  Ver Mascota
                </Button>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Información del Adoptante</h2>
              <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-gray-800">
                      <span className="font-medium">Nombre:</span> {solicitud.usuarioAdoptante?.nombreCompleto || solicitud.adoptante?.nombre || 'N/A'}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">Correo:</span> {solicitud.usuarioAdoptante?.correoElectronico || solicitud.adoptante?.correoElectronico || 'N/A'}
                    </p>
                    <p className="text-gray-800">
                      <span className="font-medium">Teléfono:</span> {solicitud.usuarioAdoptante?.telefono || solicitud.adoptante?.telefono || 'N/A'}
                    </p>
              </div>
            </div>

            {solicitud.mensajeAdoptante && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Mensaje del Adoptante</h2>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-800 whitespace-pre-wrap">{solicitud.mensajeAdoptante}</p>
                </div>
              </div>
            )}

            <div className="text-sm text-gray-500">
              <p>Fecha de solicitud: {new Date(solicitud.fechaSolicitud).toLocaleString()}</p>
            </div>

            {solicitud.estadoSolicitud === 'PENDIENTE' && (
              <div className="pt-4 flex gap-3">
                <Button
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  onClick={() => navigate(`/decision-solicitud/${solicitud.idSolicitud}`)}
                >
                  <i className="fas fa-gavel mr-2"></i>Tomar Decisión
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => navigate('/listar-solicitudes')}
                >
                  <i className="fas fa-arrow-left mr-2"></i>Volver
                </Button>
              </div>
            )}
            
            {solicitud.estadoSolicitud !== 'PENDIENTE' && (
              <div className="pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full"
                  onClick={() => navigate('/listar-solicitudes')}
                >
                  <i className="fas fa-arrow-left mr-2"></i>Volver a Solicitudes
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerSolicitud;

