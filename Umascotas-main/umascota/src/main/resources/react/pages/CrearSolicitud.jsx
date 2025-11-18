import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const CrearSolicitud = () => {
  const { idMascota } = useParams();
  const navigate = useNavigate();
  const [mascota, setMascota] = useState(null);
  const [formData, setFormData] = useState({
    mensajeAdoptante: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    const idUsuario = localStorage.getItem('idUsuario');
    if (rol !== 'USUARIO' || !idUsuario) {
      navigate('/login');
      return;
    }
    cargarMascota();
  }, [idMascota, navigate]);

  const cargarMascota = async () => {
    try {
      const response = await fetch(`/api/mascotas/${idMascota}`);
      if (response.ok) {
        const data = await response.json();
        setMascota(data);
      } else {
        setError('Mascota no encontrada');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) {
      setError('Debes iniciar sesión');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/solicitudes/mascota/${idMascota}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUsuario: parseInt(idUsuario),
          mensajeAdoptante: formData.mensajeAdoptante,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Solicitud creada exitosamente');
        navigate('/dashboard-usuario');
      } else {
        setError(typeof data === 'string' ? data : (data.message || 'Error al crear la solicitud'));
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (!mascota && !error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#22C55E] text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="USUARIO" />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/dashboard-usuario')}>
            <i className="fas fa-arrow-left mr-2"></i>Volver al Dashboard
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-800 mb-2">Solicitar Adopción</h1>
          <p className="text-gray-500">Completa el formulario para solicitar la adopción</p>
        </div>

        {mascota && (
          <Card className="p-6 mb-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{mascota.nombre}</h3>
            <p className="text-gray-600">{mascota.especie} - {mascota.raza || 'Sin raza'}</p>
          </Card>
        )}

        <Card className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje para el administrador *
              </label>
              <textarea
                name="mensajeAdoptante"
                value={formData.mensajeAdoptante}
                onChange={handleChange}
                rows="6"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4ADE80] focus:bg-white focus:ring-4 focus:ring-[#4ADE80]/20"
                placeholder="Explica por qué quieres adoptar esta mascota, tu experiencia con animales, el ambiente donde vivirá, etc."
                required
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Enviando...' : 'Enviar Solicitud'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate(`/mascota/${idMascota}`)}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CrearSolicitud;

