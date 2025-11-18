import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

const DashboardAdmin = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalMascotas: 0,
    totalSolicitudes: 0,
    solicitudesAceptadas: 0,
    solicitudesPendientes: 0,
  });
  const [mascotasRecientes, setMascotasRecientes] = useState([]);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (rol !== 'ADMIN') {
      navigate('/');
      return;
    }
    cargarEstadisticas();
  }, [navigate]);

  const cargarEstadisticas = async () => {
    try {
      // Cargar mascotas
      const mascotasRes = await fetch('/api/mascotas');
      if (mascotasRes.ok) {
        const mascotas = await mascotasRes.json();
        setStats(prev => ({ ...prev, totalMascotas: mascotas.length }));
        setMascotasRecientes(mascotas.slice(0, 4));
      }

      // Cargar solicitudes
      const solicitudesRes = await fetch('/api/solicitudes');
      if (solicitudesRes.ok) {
        const solicitudes = await solicitudesRes.json();
        const aceptadas = solicitudes.filter(s => s.estadoSolicitud === 'ACEPTADA').length;
        const pendientes = solicitudes.filter(s => s.estadoSolicitud === 'PENDIENTE');
        setStats(prev => ({
          ...prev,
          totalSolicitudes: solicitudes.length,
          solicitudesAceptadas: aceptadas,
          solicitudesPendientes: pendientes.length,
        }));
        setSolicitudesPendientes(pendientes.slice(0, 5));
      }
    } catch (error) {
      console.error('Error cargando estadísticas:', error);
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
      <Navbar userRole="ADMIN" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-light text-gray-800 mb-2">Panel de Administración</h1>
            <p className="text-gray-500">Gestiona mascotas, solicitudes y adopciones</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/adopciones')}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700"
            >
              <i className="fas fa-heart mr-2"></i>Adopciones
            </button>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Mascotas</p>
                <p className="text-3xl font-semibold text-gray-800">{stats.totalMascotas}</p>
              </div>
              <div className="w-12 h-12 bg-[#D1FAE5] rounded-full flex items-center justify-center">
                <i className="fas fa-paw text-[#22C55E] text-xl"></i>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Solicitudes</p>
                <p className="text-3xl font-semibold text-gray-800">{stats.totalSolicitudes}</p>
              </div>
              <div className="w-12 h-12 bg-[#D1FAE5] rounded-full flex items-center justify-center">
                <i className="fas fa-file-alt text-[#22C55E] text-xl"></i>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Aceptadas</p>
                <p className="text-3xl font-semibold text-[#22C55E]">{stats.solicitudesAceptadas}</p>
              </div>
              <div className="w-12 h-12 bg-[#D1FAE5] rounded-full flex items-center justify-center">
                <i className="fas fa-check text-[#22C55E] text-xl"></i>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Pendientes</p>
                <p className="text-3xl font-semibold text-orange-600">{stats.solicitudesPendientes}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <i className="fas fa-clock text-orange-600 text-xl"></i>
              </div>
            </div>
          </Card>
        </div>

        {/* Mascotas Recientes */}
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Mascotas Recientes</h2>
            <button
              onClick={() => navigate('/listar-mascotas')}
              className="text-[#22C55E] hover:text-[#16A34A] font-medium"
            >
              Ver todas →
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {mascotasRecientes.length === 0 ? (
              <div className="col-span-4 text-center py-8 text-gray-400">No hay mascotas disponibles</div>
            ) : (
              mascotasRecientes.map((mascota) => (
                <div
                  key={mascota.idMascota}
                  onClick={() => navigate(`/mascota/${mascota.idMascota}`)}
                  className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
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
                      <i className="fas fa-paw text-gray-400 text-3xl"></i>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-800">{mascota.nombre}</h3>
                  <p className="text-sm text-gray-500">{mascota.especie}</p>
                  <p className="text-xs text-gray-400">{mascota.statusPublicacion || 'DISPONIBLE'}</p>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Solicitudes Pendientes */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Solicitudes Pendientes</h2>
            <button
              onClick={() => navigate('/listar-solicitudes')}
              className="text-[#22C55E] hover:text-[#16A34A] font-medium"
            >
              Ver todas →
            </button>
          </div>
          <div className="space-y-3">
            {solicitudesPendientes.length === 0 ? (
              <div className="text-center py-8 text-gray-400">No hay solicitudes pendientes</div>
            ) : (
              solicitudesPendientes.map((solicitud) => (
                <div
                  key={solicitud.idSolicitud}
                  onClick={() => navigate(`/ver-solicitud/${solicitud.idSolicitud}`)}
                  className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow flex justify-between items-center"
                >
                  <div>
                    <p className="font-semibold text-gray-800">Solicitud #{solicitud.idSolicitud}</p>
                    <p className="text-sm text-gray-500">
                      Mascota: {solicitud.mascotaSolicitada?.nombre || solicitud.mascota?.nombre || `ID: ${solicitud.mascotaSolicitada?.idMascota || solicitud.mascota?.idMascota || 'N/A'}`}
                    </p>
                    <p className="text-xs text-gray-400">
                      Por: {solicitud.usuarioAdoptante?.nombreCompleto || solicitud.adoptante?.nombre || 'N/A'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/ver-solicitud/${solicitud.idSolicitud}`);
                      }}
                      className="bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                      title="Ver detalles"
                    >
                      <i className="fas fa-eye"></i>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/decision-solicitud/${solicitud.idSolicitud}`);
                      }}
                      className="bg-[#4ADE80] text-white px-4 py-2 rounded-lg hover:bg-[#22C55E] transition-colors text-sm"
                    >
                      <i className="fas fa-check mr-1"></i>Revisar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DashboardAdmin;

