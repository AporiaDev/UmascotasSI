import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Button from '../components/Button';
import Input from '../components/Input';

const PerfilUsuario = () => {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    telefono: '',
    ciudad: '',
    direccion: '',
    documentoIdentidad: '',
    notificationsEnabled: true,
  });
  const [guardando, setGuardando] = useState(false);
  const idUsuario = localStorage.getItem('idUsuario');
  const rol = localStorage.getItem('rol');

  useEffect(() => {
    if (!rol || rol !== 'USUARIO') {
      navigate('/');
      return;
    }
    cargarPerfil();
  }, [navigate, rol]);

  const cargarPerfil = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/usuarios/${idUsuario}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUsuario(data);
        // Inicializar formData con los datos del usuario
        setFormData({
          nombreCompleto: data.nombreCompleto || '',
          telefono: data.telefono || '',
          ciudad: data.ciudad || '',
          direccion: data.direccion || '',
          documentoIdentidad: data.documentoIdentidad || '',
          notificationsEnabled: data.notificationsEnabled !== undefined ? data.notificationsEnabled : true,
        });
      } else {
        setError('Error al cargar el perfil');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
    setError('');
  };

  const handleGuardar = async () => {
    setGuardando(true);
    setError('');
    setSuccessMessage('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/usuarios/${idUsuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setUsuario(data);
        setEditando(false);
        setSuccessMessage('Perfil actualizado exitosamente');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        const errorData = await response.json();
        setError(typeof errorData === 'string' ? errorData : (errorData.message || 'Error al actualizar el perfil'));
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  const handleCancelar = () => {
    // Restaurar los datos originales
    if (usuario) {
      setFormData({
        nombreCompleto: usuario.nombreCompleto || '',
        telefono: usuario.telefono || '',
        ciudad: usuario.ciudad || '',
        direccion: usuario.direccion || '',
        documentoIdentidad: usuario.documentoIdentidad || '',
        notificationsEnabled: usuario.notificationsEnabled !== undefined ? usuario.notificationsEnabled : true,
      });
    }
    setEditando(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#22C55E] text-xl">Cargando perfil...</div>
      </div>
    );
  }

  if (error || !usuario) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole={rol} />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="p-8 text-center">
            <p className="text-red-600 text-xl mb-4">{error || 'Usuario no encontrado'}</p>
            <Button onClick={() => navigate('/dashboard-usuario')}>Volver al Dashboard</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={rol} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/dashboard-usuario')}>
            <i className="fas fa-arrow-left mr-2"></i>Volver al Dashboard
          </Button>
        </div>

        <Card className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-light text-gray-800 mb-2">Mi Perfil</h1>
              <p className="text-gray-500">Información de tu cuenta</p>
            </div>
            <div className="flex items-center gap-4">
              {!editando ? (
                <Button
                  variant="primary"
                  onClick={() => setEditando(true)}
                >
                  <i className="fas fa-edit mr-2"></i>Editar Perfil
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="primary"
                    onClick={handleGuardar}
                    disabled={guardando}
                  >
                    {guardando ? (
                      <>
                        <i className="fas fa-spinner fa-spin mr-2"></i>Guardando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-save mr-2"></i>Guardar Cambios
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancelar}
                    disabled={guardando}
                  >
                    <i className="fas fa-times mr-2"></i>Cancelar
                  </Button>
                </div>
              )}
              <div className="w-20 h-20 bg-[#4ADE80] rounded-full flex items-center justify-center">
                <i className="fas fa-user text-white text-3xl"></i>
              </div>
            </div>
          </div>

          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center mb-4">
              {successMessage}
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center mb-4">
              {error}
            </div>
          )}

          <div className="space-y-6">
            {/* Información Personal */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-user-circle mr-3 text-[#22C55E]"></i>
                Información Personal
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre Completo
                    </label>
                    {editando ? (
                      <Input
                        name="nombreCompleto"
                        value={formData.nombreCompleto}
                        onChange={handleChange}
                        placeholder="Nombre completo"
                      />
                    ) : (
                      <p className="text-gray-900 text-lg">{usuario.nombreCompleto || 'No especificado'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Correo Electrónico
                    </label>
                    <p className="text-gray-900 text-lg">{usuario.correoElectronico || 'No especificado'}</p>
                    <p className="text-xs text-gray-500 mt-1">El correo no se puede modificar</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Teléfono
                    </label>
                    {editando ? (
                      <Input
                        name="telefono"
                        type="tel"
                        value={formData.telefono}
                        onChange={handleChange}
                        placeholder="+57 300 123 4567"
                      />
                    ) : (
                      <p className="text-gray-900 text-lg">{usuario.telefono || 'No especificado'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ciudad
                    </label>
                    {editando ? (
                      <Input
                        name="ciudad"
                        value={formData.ciudad}
                        onChange={handleChange}
                        placeholder="Ciudad"
                      />
                    ) : (
                      <p className="text-gray-900 text-lg">{usuario.ciudad || 'No especificado'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dirección
                    </label>
                    {editando ? (
                      <Input
                        name="direccion"
                        value={formData.direccion}
                        onChange={handleChange}
                        placeholder="Dirección"
                      />
                    ) : (
                      <p className="text-gray-900 text-lg">{usuario.direccion || 'No especificado'}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Documento de Identidad
                    </label>
                    {editando ? (
                      <Input
                        name="documentoIdentidad"
                        value={formData.documentoIdentidad}
                        onChange={handleChange}
                        placeholder="Documento de identidad"
                      />
                    ) : (
                      <p className="text-gray-900 text-lg">{usuario.documentoIdentidad || 'No especificado'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Información de la Cuenta */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-cog mr-3 text-[#22C55E]"></i>
                Información de la Cuenta
              </h2>
              <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rol
                    </label>
                    <span className="inline-block px-3 py-1 bg-[#D1FAE5] text-[#16A34A] rounded-full text-sm font-medium">
                      {usuario.rol || usuario.tipoUsuario || 'USUARIO'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Fecha de Registro
                    </label>
                    <p className="text-gray-900 text-lg">
                      {usuario.fechaRegistro 
                        ? new Date(usuario.fechaRegistro).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })
                        : 'No disponible'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Verificado
                    </label>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                      usuario.emailVerified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {usuario.emailVerified ? 'Verificado' : 'No verificado'}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notificaciones
                    </label>
                    {editando ? (
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          name="notificationsEnabled"
                          checked={formData.notificationsEnabled}
                          onChange={handleChange}
                          className="w-5 h-5 text-[#22C55E] border-gray-300 rounded focus:ring-[#22C55E]"
                        />
                        <span className="text-gray-700">
                          {formData.notificationsEnabled ? 'Activadas' : 'Desactivadas'}
                        </span>
                      </label>
                    ) : (
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        usuario.notificationsEnabled 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {usuario.notificationsEnabled ? 'Activadas' : 'Desactivadas'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Estadísticas Rápidas */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <i className="fas fa-chart-bar mr-3 text-[#22C55E]"></i>
                Estadísticas
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-6 text-center bg-gradient-to-br from-[#D1FAE5] to-[#BBF7D0]">
                  <div className="text-3xl font-bold text-[#16A34A] mb-2">
                    <i className="fas fa-heart"></i>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Adopciones</p>
                  <p className="text-2xl font-semibold text-gray-800">-</p>
                  <p className="text-xs text-gray-500 mt-2">Ver en Mis Adopciones</p>
                </Card>
                <Card className="p-6 text-center bg-gradient-to-br from-[#D1FAE5] to-[#BBF7D0]">
                  <div className="text-3xl font-bold text-[#16A34A] mb-2">
                    <i className="fas fa-file-alt"></i>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Solicitudes</p>
                  <p className="text-2xl font-semibold text-gray-800">-</p>
                  <p className="text-xs text-gray-500 mt-2">Ver en Mis Solicitudes</p>
                </Card>
                <Card className="p-6 text-center bg-gradient-to-br from-[#D1FAE5] to-[#BBF7D0]">
                  <div className="text-3xl font-bold text-[#16A34A] mb-2">
                    <i className="fas fa-calendar"></i>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">Miembro desde</p>
                  <p className="text-lg font-semibold text-gray-800">
                    {usuario.fechaRegistro 
                      ? new Date(usuario.fechaRegistro).getFullYear()
                      : '-'}
                  </p>
                </Card>
              </div>
            </div>

            {/* Acciones Rápidas */}
            <div className="flex gap-4 pt-4">
              <Button
                variant="primary"
                onClick={() => navigate('/dashboard-usuario')}
                className="flex-1"
              >
                <i className="fas fa-home mr-2"></i>Ir al Dashboard
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/listar-mascotas')}
                className="flex-1"
              >
                <i className="fas fa-paw mr-2"></i>Ver Mascotas
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PerfilUsuario;

