import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';

const Navbar = ({ userRole = null }) => {
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('idUsuario');
    navigate('/');
  };

  const isAdmin = userRole === 'ADMIN';
  const isUsuario = userRole === 'USUARIO';

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-3">
            <Link to="/">
              <Logo size={32} showText={false} />
            </Link>
            <span className="text-xl font-semibold text-gray-800">U-Mascota</span>
            {isAdmin && <span className="text-sm text-[#22C55E] font-medium">Admin</span>}
          </div>
          
          <div className="flex items-center space-x-4">
            {isAdmin && (
              <>
                <Link
                  to="/listar-mascotas"
                  className="text-gray-600 hover:text-[#22C55E] px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className="fas fa-paw mr-2"></i>Mascotas
                </Link>
                <Link
                  to="/listar-solicitudes"
                  className="text-gray-600 hover:text-[#22C55E] px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className="fas fa-file-alt mr-2"></i>Solicitudes
                </Link>
                <Link
                  to="/crear-mascota"
                  className="text-gray-600 hover:text-[#22C55E] px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className="fas fa-plus mr-2"></i>Nueva Mascota
                </Link>
              </>
            )}
            
            {isUsuario && (
              <>
                <Link
                  to="/listar-mascotas"
                  className="text-gray-600 hover:text-[#22C55E] px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className="fas fa-paw mr-2"></i>Mascotas
                </Link>
                <Link
                  to="/adopciones"
                  className="text-gray-600 hover:text-[#22C55E] px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className="fas fa-heart mr-2"></i>Mis Adopciones
                </Link>
                <Link
                  to="/perfil"
                  className="text-gray-600 hover:text-[#22C55E] px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className="fas fa-user mr-2"></i>Mi Perfil
                </Link>
              </>
            )}

            {!userRole && (
              <>
                <Link
                  to="/listar-mascotas"
                  className="text-gray-600 hover:text-[#22C55E] px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <i className="fas fa-paw mr-2"></i>Mascotas
                </Link>
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-[#22C55E] px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Iniciar Sesión
                </Link>
              </>
            )}

            {userRole && (
              <button
                onClick={cerrarSesion}
                className="text-gray-600 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>Cerrar Sesión
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

