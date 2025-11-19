import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';

const ListarSolicitudes = () => {
  const navigate = useNavigate();
  const [solicitudes, setSolicitudes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelandoId, setCancelandoId] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const rol = localStorage.getItem('rol');
  const idUsuario = localStorage.getItem('idUsuario');
  const isAdmin = rol === 'ADMIN';

  useEffect(() => {
    // Verificar que el usuario esté autenticado
    if (!rol) {
      navigate('/login');
      return;
    }
    cargarSolicitudes();
  }, [navigate, rol]);

  const cargarSolicitudes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/solicitudes');
      if (response.ok) {
        const data = await response.json();
        let solicitudesFiltradas = Array.isArray(data) ? data : [];
        
        // Si es usuario, filtrar SOLO sus solicitudes
        if (rol === 'USUARIO' && idUsuario) {
          const idUsuarioNum = parseInt(idUsuario);
          solicitudesFiltradas = solicitudesFiltradas.filter((s) => {
            // El campo usuarioAdoptante es un objeto Usuario que tiene idUsuario
            const usuarioAdoptanteId = s.usuarioAdoptante?.idUsuario;
            
            // Comparar tanto como número como string para mayor robustez
            return (
              usuarioAdoptanteId === idUsuarioNum ||
              usuarioAdoptanteId?.toString() === idUsuario ||
              String(usuarioAdoptanteId) === String(idUsuario)
            );
          });
          
          // Log para depuración (puedes removerlo después)
          console.log(`Usuario ${idUsuario} - Solicitudes filtradas:`, solicitudesFiltradas.length);
        }
        
        setSolicitudes(solicitudesFiltradas);
      }
    } catch (error) {
      console.error('Error cargando solicitudes:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const cancelarSolicitud = async (idSolicitud) => {
    if (!window.confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) {
      return;
    }

    setCancelandoId(idSolicitud);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/solicitudes/${idSolicitud}/cancelar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ idUsuario: parseInt(idUsuario) }),
      });

      if (response.ok) {
        setSuccessMessage('Solicitud cancelada exitosamente');
        setTimeout(() => setSuccessMessage(''), 3000);
        // Recargar las solicitudes
        cargarSolicitudes();
      } else {
        const errorData = await response.json();
        setError(typeof errorData === 'string' ? errorData : (errorData.message || 'Error al cancelar la solicitud'));
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setCancelandoId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={rol} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          {isAdmin ? (
            <Button variant="outline" onClick={() => navigate('/dashboard-admin')}>
              <i className="fas fa-arrow-left mr-2"></i>Volver al Dashboard
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate('/dashboard-usuario')}>
              <i className="fas fa-arrow-left mr-2"></i>Volver al Dashboard
            </Button>
          )}
        </div>
        
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-800 mb-2">
            {isAdmin ? 'Solicitudes de Adopción' : 'Mis Solicitudes de Adopción'}
          </h1>
          <p className="text-gray-500">
            {isAdmin ? 'Gestiona las solicitudes de adopción' : 'Revisa el estado de tus solicitudes'}
          </p>
        </div>

        {successMessage && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center mb-4">
            {successMessage}
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-[#22C55E] text-xl">Cargando solicitudes...</div>
          </div>
        ) : solicitudes.length === 0 ? (
          <Card className="p-12 text-center">
            <i className="fas fa-file-alt text-gray-300 text-6xl mb-4"></i>
            <p className="text-gray-500 text-xl mb-4">
              {isAdmin ? 'No hay solicitudes' : 'No has realizado ninguna solicitud de adopción'}
            </p>
            {!isAdmin && (
              <Button
                variant="primary"
                onClick={() => navigate('/listar-mascotas')}
              >
                <i className="fas fa-paw mr-2"></i>Ver Mascotas Disponibles
              </Button>
            )}
          </Card>
        ) : (
          <div className="space-y-4">
            {solicitudes.map((solicitud) => (
              <Card key={solicitud.idSolicitud} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-800">
                        Solicitud #{solicitud.idSolicitud}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(
                          solicitud.estadoSolicitud
                        )}`}
                      >
                        {solicitud.estadoSolicitud}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      <span className="font-medium">Mascota:</span>{' '}
                      {solicitud.mascotaSolicitada?.nombre || solicitud.mascota?.nombre || `ID: ${solicitud.mascotaSolicitada?.idMascota || solicitud.mascota?.idMascota || 'N/A'}`}
                    </p>
                    {isAdmin && (
                      <p className="text-gray-600 mb-2">
                        <span className="font-medium">Adoptante:</span>{' '}
                        {solicitud.usuarioAdoptante?.nombreCompleto || solicitud.adoptante?.nombre || 'N/A'}
                      </p>
                    )}
                    {solicitud.mensajeAdoptante && (
                      <p className="text-gray-500 text-sm mt-2">
                        "{solicitud.mensajeAdoptante}"
                      </p>
                    )}
                    <p className="text-gray-400 text-xs mt-2">
                      Fecha: {new Date(solicitud.fechaSolicitud).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-4">
                    {isAdmin ? (
                      <>
                        <Button
                          variant="primary"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/ver-solicitud/${solicitud.idSolicitud}`)}
                        >
                          <i className="fas fa-eye mr-2"></i>Ver Detalles
                        </Button>
                        {solicitud.estadoSolicitud === 'PENDIENTE' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/decision-solicitud/${solicitud.idSolicitud}`)}
                          >
                            <i className="fas fa-gavel mr-2"></i>Decidir
                          </Button>
                        )}
                      </>
                    ) : (
                      <div className="flex flex-col gap-2 w-full">
                        <Button
                          variant="primary"
                          size="sm"
                          className="w-full"
                          onClick={() => navigate(`/mascota/${solicitud.mascotaSolicitada?.idMascota || solicitud.mascota?.idMascota}`)}
                        >
                          <i className="fas fa-eye mr-2"></i>Ver Mascota
                        </Button>
                        {solicitud.estadoSolicitud === 'PENDIENTE' && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full text-red-600 border-red-300 hover:bg-red-50"
                            onClick={() => cancelarSolicitud(solicitud.idSolicitud)}
                            disabled={cancelandoId === solicitud.idSolicitud}
                          >
                            {cancelandoId === solicitud.idSolicitud ? (
                              <>
                                <i className="fas fa-spinner fa-spin mr-2"></i>Cancelando...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-times mr-2"></i>Cancelar Solicitud
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListarSolicitudes;

