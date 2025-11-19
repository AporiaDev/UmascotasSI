import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardAdmin from './pages/DashboardAdmin';
import DashboardUsuario from './pages/DashboardUsuario';
import ListarMascotas from './pages/ListarMascotas';
import CrearMascota from './pages/CrearMascota';
import VerMascota from './pages/VerMascota';
import ListarSolicitudes from './pages/ListarSolicitudes';
import CrearSolicitud from './pages/CrearSolicitud';
import VerSolicitud from './pages/VerSolicitud';
import DecisionSolicitud from './pages/DecisionSolicitud';
import ListarAdopciones from './pages/ListarAdopciones';
import VerAdopcion from './pages/VerAdopcion';
import EditarMascota from './pages/EditarMascota';
import PerfilUsuario from './pages/PerfilUsuario';
import NotificacionesPage from './pages/NotificacionesPage';
import GestionarEncuestas from './pages/GestionarEncuestas';
import ResponderEncuesta from './pages/ResponderEncuesta';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/listar-mascotas" element={<ListarMascotas />} />
        <Route path="/mascota/:id" element={<VerMascota />} />
        
        {/* Rutas protegidas - Requieren autenticación */}
        <Route path="/dashboard-admin" element={<ProtectedRoute requiredRole="ADMIN"><DashboardAdmin /></ProtectedRoute>} />
        <Route path="/dashboard-usuario" element={<ProtectedRoute requiredRole="USUARIO"><DashboardUsuario /></ProtectedRoute>} />
        <Route path="/perfil" element={<ProtectedRoute requiredRole="USUARIO"><PerfilUsuario /></ProtectedRoute>} />
        <Route path="/notificaciones" element={<ProtectedRoute><NotificacionesPage /></ProtectedRoute>} />
        <Route path="/gestionar-encuestas" element={<ProtectedRoute requiredRole="ADMIN"><GestionarEncuestas /></ProtectedRoute>} />
        <Route path="/responder-encuesta/:idEncuesta" element={<ProtectedRoute><ResponderEncuesta /></ProtectedRoute>} />
        <Route path="/crear-mascota" element={<ProtectedRoute requiredRole="ADMIN"><CrearMascota /></ProtectedRoute>} />
        <Route path="/editar-mascota/:id" element={<ProtectedRoute requiredRole="ADMIN"><EditarMascota /></ProtectedRoute>} />
        <Route path="/listar-solicitudes" element={<ProtectedRoute><ListarSolicitudes /></ProtectedRoute>} />
        <Route path="/crear-solicitud/:idMascota" element={<ProtectedRoute requiredRole="USUARIO"><CrearSolicitud /></ProtectedRoute>} />
        <Route path="/ver-solicitud/:id" element={<ProtectedRoute requiredRole="ADMIN"><VerSolicitud /></ProtectedRoute>} />
        <Route path="/decision-solicitud/:idSolicitud" element={<ProtectedRoute requiredRole="ADMIN"><DecisionSolicitud /></ProtectedRoute>} />
        <Route path="/adopciones" element={<ProtectedRoute><ListarAdopciones /></ProtectedRoute>} />
        <Route path="/adopcion/:id" element={<ProtectedRoute><VerAdopcion /></ProtectedRoute>} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

