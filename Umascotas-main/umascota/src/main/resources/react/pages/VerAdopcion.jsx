import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';

const VerAdopcion = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [adopcion, setAdopcion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (!rol) {
      navigate('/login');
      return;
    }
    cargarAdopcion();
  }, [id, navigate]);

  const cargarAdopcion = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/adopciones/${id}`);
      if (response.ok) {
        const data = await response.json();
        
        // Verificar que la mascota realmente esté adoptada
        if (data.mascota?.idMascota) {
          const mascotaResponse = await fetch(`/api/mascotas/${data.mascota.idMascota}`);
          if (mascotaResponse.ok) {
            const mascota = await mascotaResponse.json();
            if (mascota.statusPublicacion !== 'ADOPTADA') {
              setError('Esta adopción ya no es válida. La mascota ya no está adoptada.');
              return;
            }
          }
        }
        
        setAdopcion(data);
      } else {
        setError('Adopción no encontrada');
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

  if (error || !adopcion) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole={localStorage.getItem('rol')} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-red-600 text-xl">{error || 'Adopción no encontrada'}</p>
            <Button onClick={() => navigate('/adopciones')} className="mt-4">
              Volver a Adopciones
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const rol = localStorage.getItem('rol');
  const [eliminando, setEliminando] = useState(false);
  const [mostrarConfirmacion, setMostrarConfirmacion] = useState(false);

  const eliminarAdopcion = async () => {
    setEliminando(true);
    try {
      const response = await fetch(`/api/adopciones/${id}`, {
        method: 'DELETE',
      });

      if (response.ok || response.status === 204) {
        alert('Adopción eliminada exitosamente. La mascota ahora está disponible nuevamente.');
        // Si es usuario, redirigir a su dashboard, si es admin a la lista de adopciones
        const rol = localStorage.getItem('rol');
        if (rol === 'USUARIO') {
          navigate('/dashboard-usuario');
        } else {
          navigate('/adopciones');
        }
      } else {
        alert('Error al eliminar la adopción');
      }
    } catch (err) {
      alert('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setEliminando(false);
      setMostrarConfirmacion(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={rol} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate('/adopciones')}>
              <i className="fas fa-arrow-left mr-2"></i>Volver a Adopciones
            </Button>
            {rol === 'ADMIN' ? (
              <Button variant="outline" onClick={() => navigate('/dashboard-admin')}>
                <i className="fas fa-home mr-2"></i>Dashboard
              </Button>
            ) : (
              <Button variant="outline" onClick={() => navigate('/dashboard-usuario')}>
                <i className="fas fa-home mr-2"></i>Dashboard
              </Button>
            )}
          </div>
          {rol === 'ADMIN' && (
            <Button
              variant="outline"
              className="text-red-600 border-red-300 hover:bg-red-50"
              onClick={() => setMostrarConfirmacion(true)}
              disabled={eliminando}
            >
              <i className="fas fa-trash mr-2"></i>Eliminar Adopción
            </Button>
          )}
        </div>

        {mostrarConfirmacion && (
          <Card className="p-6 mb-6 bg-red-50 border-red-200">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Confirmar Eliminación</h3>
            <p className="text-red-700 mb-4">
              ¿Estás seguro de que deseas eliminar esta adopción? La mascota volverá a estar disponible para adopción.
            </p>
            <div className="flex gap-3">
              <Button
                variant="primary"
                className="bg-red-600 hover:bg-red-700"
                onClick={eliminarAdopcion}
                disabled={eliminando}
              >
                {eliminando ? 'Eliminando...' : 'Sí, Eliminar'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setMostrarConfirmacion(false)}
                disabled={eliminando}
              >
                Cancelar
              </Button>
            </div>
          </Card>
        )}

        <Card className="p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-semibold text-gray-800">Adopción #{adopcion.idAdopcion}</h1>
            <span className="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <i className="fas fa-check-circle mr-2"></i>Adoptada
            </span>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Información de la Mascota</h2>
              <div className="md:flex gap-6">
                {adopcion.mascota?.foto && (
                  <div className="md:w-1/3 mb-4 md:mb-0">
                    <img
                      src={adopcion.mascota.foto}
                      alt={adopcion.mascota.nombre}
                      className="w-full h-64 object-cover rounded-xl"
                      onError={(e) => {
                        e.target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className={`bg-gray-50 rounded-xl p-4 ${adopcion.mascota?.foto ? 'md:w-2/3' : 'w-full'}`}>
                  <p className="text-gray-800 mb-2">
                    <span className="font-medium">Nombre:</span> {adopcion.mascota?.nombre || 'N/A'}
                  </p>
                  <p className="text-gray-800 mb-2">
                    <span className="font-medium">Especie:</span> {adopcion.mascota?.especie || 'N/A'}
                  </p>
                  <p className="text-gray-800 mb-2">
                    <span className="font-medium">Raza:</span> {adopcion.mascota?.raza || 'N/A'}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/mascota/${adopcion.mascota?.idMascota}`)}
                    >
                      <i className="fas fa-eye mr-2"></i>Ver Mascota
                    </Button>
                    {rol === 'ADMIN' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/editar-mascota/${adopcion.mascota?.idMascota}`)}
                      >
                        <i className="fas fa-edit mr-2"></i>Editar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {rol === 'ADMIN' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Información del Adoptante</h2>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-gray-800 mb-2">
                    <span className="font-medium">Nombre:</span> {adopcion.usuarioAdoptante?.nombreCompleto || adopcion.adoptante?.nombre || 'N/A'}
                  </p>
                  <p className="text-gray-800 mb-2">
                    <span className="font-medium">Correo:</span> {adopcion.usuarioAdoptante?.correoElectronico || adopcion.adoptante?.correoElectronico || 'N/A'}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-medium">Teléfono:</span> {adopcion.usuarioAdoptante?.telefono || adopcion.adoptante?.telefono || 'N/A'}
                  </p>
                </div>
              </div>
            )}

            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Detalles de la Adopción</h2>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-800 mb-2">
                  <span className="font-medium">Fecha de Adopción:</span>{' '}
                  {new Date(adopcion.fechaAdopcion).toLocaleDateString()}
                </p>
                {adopcion.encuestaPostAdopcion && (
                  <div className="mt-4">
                    <p className="font-medium text-gray-800 mb-2">Encuesta Post-Adopción:</p>
                    <div className="text-sm text-gray-600 space-y-1">
                      {adopcion.encuestaPostAdopcion.saludMascota && (
                        <p>Salud: {adopcion.encuestaPostAdopcion.saludMascota}</p>
                      )}
                      {adopcion.encuestaPostAdopcion.adaptacionMascota && (
                        <p>Adaptación: {adopcion.encuestaPostAdopcion.adaptacionMascota}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerAdopcion;

