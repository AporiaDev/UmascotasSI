import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Notificaciones = ({ idUsuario }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [noLeidas, setNoLeidas] = useState(0);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);
  const [cargando, setCargando] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (idUsuario) {
      cargarNotificaciones();
      // Recargar notificaciones cada 30 segundos
      const interval = setInterval(cargarNotificaciones, 30000);
      return () => clearInterval(interval);
    }
  }, [idUsuario]);

  useEffect(() => {
    // Cerrar dropdown al hacer clic fuera
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setMostrarDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cargarNotificaciones = async () => {
    if (!idUsuario) return;
    
    try {
      const [response, countResponse] = await Promise.all([
        fetch(`/api/notificaciones/usuario/${idUsuario}/no-leidas`),
        fetch(`/api/notificaciones/usuario/${idUsuario}/contar`)
      ]);

      if (response.ok) {
        const data = await response.json();
        setNotificaciones(data.slice(0, 5)); // Solo mostrar las 5 más recientes
      }

      if (countResponse.ok) {
        const countData = await countResponse.json();
        setNoLeidas(countData.count || 0);
      }
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  const marcarComoLeida = async (idNotificacion, idReferencia, tipo) => {
    try {
      await fetch(`/api/notificaciones/${idNotificacion}/leida`, {
        method: 'PUT'
      });
      
      // Actualizar estado local
      setNotificaciones(prev => prev.filter(n => n.idNotificacion !== idNotificacion));
      setNoLeidas(prev => Math.max(0, prev - 1));
      
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
    if (!idUsuario) return;
    
    setCargando(true);
    try {
      await fetch(`/api/notificaciones/usuario/${idUsuario}/marcar-todas-leidas`, {
        method: 'PUT'
      });
      setNotificaciones([]);
      setNoLeidas(0);
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    } finally {
      setCargando(false);
    }
  };

  if (!idUsuario) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setMostrarDropdown(!mostrarDropdown)}
        className="relative text-gray-600 hover:text-[#22C55E] px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
        title="Notificaciones"
      >
        <i className="fas fa-bell text-xl"></i>
        {noLeidas > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {noLeidas > 9 ? '9+' : noLeidas}
          </span>
        )}
      </button>

      {mostrarDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">Notificaciones</h3>
            {noLeidas > 0 && (
              <button
                onClick={marcarTodasComoLeidas}
                disabled={cargando}
                className="text-sm text-[#22C55E] hover:underline disabled:opacity-50"
              >
                {cargando ? 'Marcando...' : 'Marcar todas como leídas'}
              </button>
            )}
          </div>

          <div className="overflow-y-auto flex-1">
            {notificaciones.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <i className="fas fa-bell-slash text-3xl mb-2"></i>
                <p>No hay notificaciones nuevas</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notificaciones.map((notificacion) => (
                  <div
                    key={notificacion.idNotificacion}
                    className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notificacion.leida ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => marcarComoLeida(
                      notificacion.idNotificacion,
                      notificacion.idReferencia,
                      notificacion.tipo
                    )}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`flex-shrink-0 mt-1 ${
                        notificacion.tipo === 'NUEVA_MASCOTA' ? 'text-[#22C55E]' : 'text-blue-500'
                      }`}>
                        {notificacion.tipo === 'NUEVA_MASCOTA' ? (
                          <i className="fas fa-paw"></i>
                        ) : (
                          <i className="fas fa-envelope"></i>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {notificacion.titulo}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {notificacion.mensaje}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notificacion.fechaCreacion).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                      {!notificacion.leida && (
                        <div className="flex-shrink-0">
                          <span className="h-2 w-2 bg-blue-500 rounded-full inline-block"></span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notificaciones.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200">
              <button
                onClick={() => {
                  setMostrarDropdown(false);
                  navigate('/notificaciones');
                }}
                className="w-full text-center text-sm text-[#22C55E] hover:underline"
              >
                Ver todas las notificaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notificaciones;

