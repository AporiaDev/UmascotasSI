import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';

const ListarAdopciones = () => {
  const navigate = useNavigate();
  const [adopciones, setAdopciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [eliminandoId, setEliminandoId] = useState(null);
  const [confirmacionId, setConfirmacionId] = useState(null);
  const rol = localStorage.getItem('rol');
  const idUsuario = localStorage.getItem('idUsuario');

  useEffect(() => {
    if (!rol) {
      navigate('/login');
      return;
    }
    
    const cargar = async () => {
      await cargarAdopciones();
    };
    cargar();
    
    // Recargar adopciones cada 10 segundos para detectar cambios
    const interval = setInterval(() => {
      cargar();
    }, 10000);
    
    return () => clearInterval(interval);
  }, [navigate, rol]);

  const cargarAdopciones = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/adopciones');
      if (response.ok) {
        const todasAdopciones = await response.json();
        
        // Verificar el estado real de cada mascota para filtrar adopciones válidas
        const adopcionesValidas = [];
        for (const adopcion of todasAdopciones) {
          if (adopcion.mascota?.idMascota) {
            try {
              const mascotaResponse = await fetch(`/api/mascotas/${adopcion.mascota.idMascota}`);
              if (mascotaResponse.ok) {
                const mascota = await mascotaResponse.json();
                // Solo incluir si la mascota realmente está adoptada
                if (mascota.statusPublicacion === 'ADOPTADA') {
                  adopcionesValidas.push(adopcion);
                }
              }
            } catch (err) {
              console.error('Error verificando mascota:', err);
            }
          }
        }
        
        // Si es usuario, filtrar solo sus adopciones válidas
        if (rol === 'USUARIO') {
          const misAdopciones = adopcionesValidas.filter(
            a => a.usuarioAdoptante?.idUsuario?.toString() === idUsuario || a.adoptante?.idUsuario?.toString() === idUsuario
          );
          setAdopciones(misAdopciones);
        } else {
          setAdopciones(adopcionesValidas);
        }
      }
    } catch (error) {
      console.error('Error cargando adopciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarAdopcion = async (idAdopcion) => {
    setEliminandoId(idAdopcion);
    try {
      const response = await fetch(`/api/adopciones/${idAdopcion}`, {
        method: 'DELETE',
      });

      if (response.ok || response.status === 204) {
        alert('Adopción eliminada exitosamente. La mascota ahora está disponible nuevamente.');
        // Recargar la lista después de un breve delay para asegurar que el backend haya actualizado
        setTimeout(() => {
          cargarAdopciones();
        }, 500);
      } else {
        alert('Error al eliminar la adopción');
      }
    } catch (err) {
      alert('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setEliminandoId(null);
      setConfirmacionId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={rol} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          {rol === 'ADMIN' ? (
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
            {rol === 'USUARIO' ? 'Mis Adopciones' : 'Todas las Adopciones'}
          </h1>
          <p className="text-gray-500">Historial de adopciones</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-[#22C55E] text-xl">Cargando adopciones...</div>
          </div>
        ) : adopciones.length === 0 ? (
          <Card className="p-12 text-center">
            <i className="fas fa-heart text-gray-300 text-6xl mb-4"></i>
            <p className="text-gray-500 text-xl">No hay adopciones</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adopciones.map((adopcion) => (
              <Card
                key={adopcion.idAdopcion}
                className="hover:shadow-xl transition-all hover:scale-105"
              >
                <div 
                  className="w-full h-48 bg-gray-200 rounded-t-xl overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/adopcion/${adopcion.idAdopcion}`)}
                >
                  {adopcion.mascota?.foto ? (
                    <img
                      src={adopcion.mascota.foto}
                      alt={adopcion.mascota.nombre}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full ${adopcion.mascota?.foto ? 'hidden' : 'flex'} items-center justify-center`}>
                    <i className="fas fa-paw text-gray-400 text-5xl"></i>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 
                      className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-[#22C55E] transition-colors"
                      onClick={() => navigate(`/adopcion/${adopcion.idAdopcion}`)}
                    >
                      {adopcion.mascota?.nombre || 'Sin nombre'}
                    </h3>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                      <i className="fas fa-check-circle"></i>
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    {adopcion.mascota?.especie || 'N/A'} - {adopcion.mascota?.raza || 'N/A'}
                  </p>
                  <p className="text-sm text-gray-500 mb-3">
                    <i className="fas fa-calendar mr-1"></i>
                    Adoptado el {new Date(adopcion.fechaAdopcion).toLocaleDateString()}
                  </p>
                  {rol === 'ADMIN' && (
                    <p className="text-sm text-gray-500 mb-3">
                      <i className="fas fa-user mr-1"></i>
                      Por: {adopcion.usuarioAdoptante?.nombreCompleto || adopcion.adoptante?.nombre || 'N/A'}
                    </p>
                  )}
                  
                  {confirmacionId === adopcion.idAdopcion ? (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-700 mb-2">¿Eliminar esta adopción?</p>
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 flex-1"
                          onClick={() => eliminarAdopcion(adopcion.idAdopcion)}
                          disabled={eliminandoId === adopcion.idAdopcion}
                        >
                          {eliminandoId === adopcion.idAdopcion ? 'Eliminando...' : 'Sí'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConfirmacionId(null)}
                          disabled={eliminandoId === adopcion.idAdopcion}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 mt-4">
                      <Button
                        variant="primary"
                        size="sm"
                        className="flex-1"
                        onClick={() => navigate(`/adopcion/${adopcion.idAdopcion}`)}
                      >
                        <i className="fas fa-eye mr-2"></i>Ver Detalles
                      </Button>
                      {rol === 'ADMIN' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 border-red-300 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmacionId(adopcion.idAdopcion);
                          }}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ListarAdopciones;

