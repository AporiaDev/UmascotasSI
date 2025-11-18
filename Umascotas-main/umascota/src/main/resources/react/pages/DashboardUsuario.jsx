import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

const DashboardUsuario = () => {
  const navigate = useNavigate();
  const [adopciones, setAdopciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (rol !== 'USUARIO') {
      navigate('/');
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
  }, [navigate]);

  const cargarAdopciones = async () => {
    try {
      const idUsuario = localStorage.getItem('idUsuario');
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
        
        // Filtrar solo las adopciones del usuario actual que sean válidas
        const misAdopciones = adopcionesValidas.filter(
          a => a.usuarioAdoptante?.idUsuario?.toString() === idUsuario || a.adoptante?.idUsuario?.toString() === idUsuario
        );
        setAdopciones(misAdopciones.slice(0, 6));
      }
    } catch (error) {
      console.error('Error cargando adopciones:', error);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="USUARIO" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-800 mb-2">Mi Dashboard</h1>
          <p className="text-gray-500">Gestiona tus adopciones y solicitudes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/listar-mascotas')}>
            <div className="w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-paw text-[#22C55E] text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ver Mascotas</h3>
            <p className="text-sm text-gray-500">Explora mascotas disponibles</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/adopciones')}>
            <div className="w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-heart text-[#22C55E] text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Mis Adopciones</h3>
            <p className="text-sm text-gray-500">Ver todas mis adopciones</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/listar-solicitudes')}>
            <div className="w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-file-alt text-[#22C55E] text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Mis Solicitudes</h3>
            <p className="text-sm text-gray-500">Estado de mis solicitudes</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/perfil')}>
            <div className="w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user text-[#22C55E] text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Mi Perfil</h3>
            <p className="text-sm text-gray-500">Ver mi información</p>
          </Card>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Mis Adopciones Recientes</h2>
            <button
              onClick={() => navigate('/adopciones')}
              className="text-[#22C55E] hover:text-[#16A34A] font-medium flex items-center"
            >
              Ver todas <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {adopciones.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-gray-400">
                No tienes adopciones aún. <br />
                <button
                  onClick={() => navigate('/listar-mascotas')}
                  className="text-[#22C55E] hover:text-[#16A34A] font-medium mt-2"
                >
                  Ver mascotas disponibles →
                </button>
              </div>
            ) : (
              adopciones.map((adopcion) => (
                <div
                  key={adopcion.idAdopcion}
                  onClick={() => navigate(`/adopcion/${adopcion.idAdopcion}`)}
                  className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
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
                      <i className="fas fa-paw text-gray-400 text-3xl"></i>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800">
                    {adopcion.mascota?.nombre || 'Sin nombre'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {adopcion.mascota?.especie || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Adoptado el {new Date(adopcion.fechaAdopcion).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardUsuario;

