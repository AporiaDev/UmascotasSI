import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

const NotificacionesPage = () => {
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtro, setFiltro] = useState('todas'); // 'todas', 'no-leidas'

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    const idUsuario = localStorage.getItem('idUsuario');
    
    if (!rol || !idUsuario) {
      navigate('/login');
      return;
    }
    
    cargarNotificaciones();
  }, [navigate, filtro]);

  const cargarNotificaciones = async () => {
    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) return;

    setCargando(true);
    try {
      const endpoint = filtro === 'no-leidas' 
        ? `/api/notificaciones/usuario/${idUsuario}/no-leidas`
        : `/api/notificaciones/usuario/${idUsuario}`;
      
      const response = await fetch(endpoint);
      if (response.ok) {
        const data = await response.json();
        setNotificaciones(data);
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setCargando(false);
    }
  };

  const marcarComoLeida = async (idNotificacion, idReferencia, tipo) => {
    try {
      await fetch(`/api/notificaciones/${idNotificacion}/leida`, {
        method: 'PUT'
      });
      
      // Actualizar estado local
      setNotificaciones(prev => 
        prev.map(n => 
          n.idNotificacion === idNotificacion 
            ? { ...n, leida: true }
            : n
        )
      );
      
      // Navegar según el tipo de notificación
      if (tipo === 'NUEVA_MASCOTA' && idReferencia) {
        navigate(`/mascota/${idReferencia}`);
      } else if (tipo === 'ENCUESTA' && idReferencia) {
        navigate(`/responder-encuesta/${idReferencia}`);
      }
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const marcarTodasComoLeidas = async () => {
    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) return;
    
    try {
      await fetch(`/api/notificaciones/usuario/${idUsuario}/marcar-todas-leidas`, {
        method: 'PUT'
      });
      cargarNotificaciones();
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  const getIconoPorTipo = (tipo) => {
    switch (tipo) {
      case 'NUEVA_MASCOTA':
        return 'fa-paw';
      case 'ENCUESTA':
        return 'fa-clipboard-list';
      default:
        return 'fa-bell';
    }
  };

  const getColorPorTipo = (tipo) => {
    switch (tipo) {
      case 'NUEVA_MASCOTA':
        return 'text-[#22C55E]';
      case 'ENCUESTA':
        return 'text-blue-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={localStorage.getItem('rol')} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-light text-gray-800 mb-2">Notificaciones</h1>
            <p className="text-gray-500">Mantente al día con las últimas novedades</p>
          </div>
          {notificaciones.filter(n => !n.leida).length > 0 && (
            <button
              onClick={marcarTodasComoLeidas}
              className="px-4 py-2 bg-[#22C55E] text-white rounded-lg hover:bg-[#16a34a] transition-colors"
            >
              Marcar todas como leídas
            </button>
          )}
        </div>

        <div className="mb-4 flex space-x-2">
          <button
            onClick={() => setFiltro('todas')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filtro === 'todas'
                ? 'bg-[#22C55E] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFiltro('no-leidas')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filtro === 'no-leidas'
                ? 'bg-[#22C55E] text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            No leídas
          </button>
        </div>

        {cargando ? (
          <div className="text-center py-12">
            <i className="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
            <p className="mt-4 text-gray-500">Cargando notificaciones...</p>
          </div>
        ) : notificaciones.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <i className="fas fa-bell-slash text-6xl text-gray-300 mb-4"></i>
            <p className="text-gray-500 text-lg">
              {filtro === 'no-leidas' 
                ? 'No tienes notificaciones sin leer' 
                : 'No tienes notificaciones'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notificaciones.map((notificacion) => (
              <div
                key={notificacion.idNotificacion}
                className={`bg-white rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow ${
                  !notificacion.leida ? 'border-l-4 border-[#22C55E]' : ''
                }`}
                onClick={() => marcarComoLeida(
                  notificacion.idNotificacion,
                  notificacion.idReferencia,
                  notificacion.tipo
                )}
              >
                <div className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 mt-1 ${getColorPorTipo(notificacion.tipo)}`}>
                    <i className={`fas ${getIconoPorTipo(notificacion.tipo)} text-2xl`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {notificacion.titulo}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          {notificacion.mensaje}
                        </p>
                        <p className="text-sm text-gray-400 mt-2">
                          {new Date(notificacion.fechaCreacion).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {!notificacion.leida && (
                        <span className="h-3 w-3 bg-blue-500 rounded-full flex-shrink-0 mt-2"></span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificacionesPage;

