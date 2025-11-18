import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';

const VerMascota = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [mascota, setMascota] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargar = async () => {
      await cargarMascota();
    };
    cargar();
    
    // Recargar cada 5 segundos para verificar cambios en el estado
    const interval = setInterval(() => {
      cargar();
    }, 5000);
    
    return () => clearInterval(interval);
  }, [id]);

  const cargarMascota = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/mascotas/${id}`);
      if (response.ok) {
        const data = await response.json();
        setMascota(data);
        setError(''); // Limpiar errores si la carga es exitosa
      } else if (response.status === 404) {
        setError('Mascota no encontrada');
      } else {
        setError('Error al cargar la información de la mascota');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearSolicitud = () => {
    const rol = localStorage.getItem('rol');
    if (!rol || rol === 'ADMIN') {
      alert('Debes iniciar sesión como usuario para adoptar');
      navigate('/login');
      return;
    }
    navigate(`/crear-solicitud/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#22C55E] text-xl">Cargando...</div>
      </div>
    );
  }

  if (error || !mascota) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole={localStorage.getItem('rol')} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-red-600 text-xl">{error || 'Mascota no encontrada'}</p>
            <Button onClick={() => navigate('/listar-mascotas')} className="mt-4">
              Volver a Mascotas
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const estado = (mascota.statusPublicacion || 'NO_DISPONIBLE').toUpperCase();
  const disponible = estado === 'DISPONIBLE';
  const rol = localStorage.getItem('rol');
  const isAdmin = rol === 'ADMIN';
  const puedeAdoptar = disponible && rol === 'USUARIO';

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={rol} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          {isAdmin ? (
            <Button variant="outline" onClick={() => navigate('/dashboard-admin')}>
              <i className="fas fa-arrow-left mr-2"></i>Volver al Dashboard
            </Button>
          ) : rol === 'USUARIO' ? (
            <Button variant="outline" onClick={() => navigate('/dashboard-usuario')}>
              <i className="fas fa-arrow-left mr-2"></i>Volver al Dashboard
            </Button>
          ) : (
            <Button variant="outline" onClick={() => navigate('/listar-mascotas')}>
              <i className="fas fa-arrow-left mr-2"></i>Volver a Mascotas
            </Button>
          )}
        </div>
        
        <Card className="overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2 bg-gray-200 min-h-[500px] overflow-hidden relative">
              {mascota.foto ? (
                <img
                  src={mascota.foto}
                  alt={mascota.nombre}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div className={`w-full h-full ${mascota.foto ? 'hidden' : 'flex'} items-center justify-center absolute inset-0`}>
                <i className="fas fa-paw text-gray-400 text-8xl"></i>
              </div>
            </div>
            
            <div className="md:w-1/2 p-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-4xl font-semibold text-gray-800">{mascota.nombre}</h1>
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    estado === 'DISPONIBLE'
                      ? 'bg-green-100 text-green-800'
                      : estado === 'RESERVADA'
                      ? 'bg-yellow-100 text-yellow-800'
                      : estado === 'ADOPTADA'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {estado}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-500 text-sm">Especie:</span>
                    <p className="text-gray-800 font-medium">{mascota.especie || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Raza:</span>
                    <p className="text-gray-800 font-medium">{mascota.raza || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Edad:</span>
                    <p className="text-gray-800 font-medium">{mascota.edad ? `${mascota.edad} años` : 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 text-sm">Sexo:</span>
                    <p className="text-gray-800 font-medium">{mascota.sexo || 'N/A'}</p>
                  </div>
                  {mascota.tamano && (
                    <div>
                      <span className="text-gray-500 text-sm">Tamaño:</span>
                      <p className="text-gray-800 font-medium">{mascota.tamano}</p>
                    </div>
                  )}
                  {mascota.estadoSalud && (
                    <div>
                      <span className="text-gray-500 text-sm">Estado de Salud:</span>
                      <p className="text-gray-800 font-medium">{mascota.estadoSalud}</p>
                    </div>
                  )}
                </div>
                
                {mascota.descripcion && (
                  <div>
                    <span className="text-gray-500 text-sm">Descripción:</span>
                    <p className="text-gray-800 mt-1">{mascota.descripcion}</p>
                  </div>
                )}
                
                <div className="flex flex-wrap gap-2">
                  {mascota.esterilizado && (
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      <i className="fas fa-check-circle mr-1"></i>Esterilizado
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {puedeAdoptar && (
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleCrearSolicitud}
                  >
                    <i className="fas fa-heart mr-2"></i>Solicitar Adopción
                  </Button>
                )}

                {isAdmin && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={() => navigate(`/editar-mascota/${mascota.idMascota}`)}
                    >
                      <i className="fas fa-edit mr-2"></i>Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      className="flex-1"
                      onClick={() => navigate('/listar-mascotas')}
                    >
                      <i className="fas fa-list mr-2"></i>Ver Todas
                    </Button>
                  </div>
                )}

                {!puedeAdoptar && disponible && rol !== 'ADMIN' && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-800 text-sm">
                    <i className="fas fa-info-circle mr-2"></i>
                    Debes iniciar sesión como usuario para adoptar esta mascota
                  </div>
                )}

                {rol === 'USUARIO' && !disponible && (
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full"
                    onClick={() => navigate('/listar-mascotas')}
                  >
                    <i className="fas fa-search mr-2"></i>Ver Otras Mascotas
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VerMascota;

