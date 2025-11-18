import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole = null, requireAuth = true }) => {
  const token = localStorage.getItem('token');
  const rol = localStorage.getItem('rol');

  // Si requiere autenticación y no hay token, redirigir a login
  if (requireAuth && !token) {
    return <Navigate to="/login" replace />;
  }

  // Si requiere un rol específico y el usuario no lo tiene, redirigir
  if (requiredRole && rol !== requiredRole) {
    if (rol === 'ADMIN') {
      return <Navigate to="/dashboard-admin" replace />;
    } else if (rol === 'USUARIO') {
      return <Navigate to="/dashboard-usuario" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

