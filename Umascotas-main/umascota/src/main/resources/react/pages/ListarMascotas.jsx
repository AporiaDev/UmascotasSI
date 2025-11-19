import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';

const ListarMascotas = () => {
  const navigate = useNavigate();
  const [mascotas, setMascotas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [verAdoptadas, setVerAdoptadas] = useState(false);
  const isAdmin = localStorage.getItem('rol') === 'ADMIN';

  useEffect(() => {
    const cargar = async () => {
      await cargarMascotas();
    };
    cargar();
    
    // Recargar mascotas cada 10 segundos para detectar cambios de estado
    const interval = setInterval(() => {
      cargar();
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const cargarMascotas = async () => {
    try {
      setLoading(true);
      setError(''); // Limpiar errores previos
      const response = await fetch('/api/mascotas');
      if (response.ok) {
        const data = await response.json();
        setMascotas(Array.isArray(data) ? data : []);
        setError(''); // Asegurar que no hay error
      } else {
        const errorText = await response.text();
        console.error('Error al cargar mascotas:', response.status, errorText);
        setError(`Error al cargar las mascotas (${response.status}): ${errorText || 'Error desconocido'}`);
      }
    } catch (err) {
      console.error('Error de conexión:', err);
      setError(`Error de conexión: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const mascotasFiltradas = verAdoptadas
    ? mascotas.filter(m => m.statusPublicacion === 'ADOPTADA')
    : mascotas.filter(m => m.statusPublicacion === 'DISPONIBLE' || m.statusPublicacion === 'RESERVADA');

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={localStorage.getItem('rol')} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          {isAdmin ? (
            <Button variant="outline" onClick={() => navigate('/dashboard-admin')}>
              <i className="fas fa-arrow-left mr-2"></i>Volver al Dashboard
            </Button>
          ) : localStorage.getItem('rol') === 'USUARIO' ? (
            <Button variant="outline" onClick={() => navigate('/dashboard-usuario')}>
              <i className="fas fa-arrow-left mr-2"></i>Volver al Dashboard
            </Button>
          ) : null}
        </div>
        
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-light text-gray-800 mb-2">Mascotas Disponibles</h1>
            <p className="text-gray-500">Encuentra tu compañero perfecto</p>
          </div>
          <div className="flex space-x-4">
            {isAdmin && (
              <Button onClick={() => navigate('/crear-mascota')}>
                <i className="fas fa-plus mr-2"></i>Nueva Mascota
              </Button>
            )}
            {isAdmin && (
              <Button
                variant="secondary"
                onClick={() => setVerAdoptadas(!verAdoptadas)}
              >
                {verAdoptadas ? 'Ver Disponibles' : 'Ver Adoptadas'}
              </Button>
            )}
          </div>
        </div>

        {error && (
          <Card className="p-4 mb-6 bg-red-50 border-red-200">
            <p className="text-red-700">{error}</p>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="text-[#22C55E] text-xl">Cargando mascotas...</div>
          </div>
        ) : mascotasFiltradas.length === 0 ? (
          <Card className="p-12 text-center">
            <i className="fas fa-paw text-gray-300 text-6xl mb-4"></i>
            <p className="text-gray-500 text-xl">No hay mascotas {verAdoptadas ? 'adoptadas' : 'disponibles'}</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mascotasFiltradas.map((mascota) => (
              <Card
                key={mascota.idMascota}
                className="cursor-pointer hover:shadow-xl transition-all hover:scale-105"
                onClick={() => navigate(`/mascota/${mascota.idMascota}`)}
              >
                <div className="w-full h-48 bg-gray-200 rounded-t-xl overflow-hidden">
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
                  <div className={`w-full h-full ${mascota.foto ? 'hidden' : 'flex'} items-center justify-center`}>
                    <i className="fas fa-paw text-gray-400 text-5xl"></i>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{mascota.nombre}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      mascota.statusPublicacion === 'DISPONIBLE' ? 'bg-green-100 text-green-800' :
                      mascota.statusPublicacion === 'RESERVADA' ? 'bg-yellow-100 text-yellow-800' :
                      mascota.statusPublicacion === 'ADOPTADA' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {mascota.statusPublicacion}
                    </span>
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium">Especie:</span> {mascota.especie}</p>
                    <p><span className="font-medium">Raza:</span> {mascota.raza || 'N/A'}</p>
                    <p><span className="font-medium">Edad:</span> {mascota.edad ? `${mascota.edad} años` : 'N/A'}</p>
                    <p><span className="font-medium">Sexo:</span> {mascota.sexo || 'N/A'}</p>
                    {mascota.tamano && <p><span className="font-medium">Tamaño:</span> {mascota.tamano}</p>}
                  </div>
                  {mascota.descripcion && (
                    <p className="mt-3 text-sm text-gray-500 line-clamp-2">{mascota.descripcion}</p>
                  )}
                  <div className="mt-4 flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      className="flex-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/mascota/${mascota.idMascota}`);
                      }}
                    >
                      <i className="fas fa-eye mr-2"></i>Ver Detalles
                    </Button>
                    {isAdmin && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/editar-mascota/${mascota.idMascota}`);
                          }}
                          title="Editar mascota"
                        >
                          <i className="fas fa-edit"></i>
                        </Button>
                      </>
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

export default ListarMascotas;

