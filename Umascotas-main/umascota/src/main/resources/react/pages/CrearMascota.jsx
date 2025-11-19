import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';

const normalizarTamano = (valor) => {
  if (!valor) return '';
  return valor.replace(/ñ/gi, 'n').toUpperCase();
};

const CrearMascota = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    especie: '',
    raza: '',
    edad: '',
    sexo: '',
    tamano: '',
    descripcion: '',
    estadoSalud: '',
    foto: '',
    statusPublicacion: 'DISPONIBLE',
    esterilizado: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    const idUsuario = localStorage.getItem('idUsuario');
    if (rol !== 'ADMIN' || !idUsuario) {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const nuevoValor = type === 'checkbox' ? checked : value;
    setFormData({
      ...formData,
      [name]: name === 'tamano' ? normalizarTamano(nuevoValor) : nuevoValor,
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const idUsuario = localStorage.getItem('idUsuario');
    if (!idUsuario) {
      setError('Debes iniciar sesión para crear una mascota');
      setLoading(false);
      return;
    }

    try {
      const mascotaData = {
        nombre: formData.nombre,
        especie: formData.especie,
        raza: formData.raza || null,
        edad: formData.edad ? parseInt(formData.edad) : null,
        sexo: formData.sexo || null,
        tamano: normalizarTamano(formData.tamano) || null,
        descripcion: formData.descripcion || null,
        estadoSalud: formData.estadoSalud || null,
        foto: formData.foto || null,
        statusPublicacion: formData.statusPublicacion.toUpperCase(),
        esterilizado: formData.esterilizado,
        idUsuarioPublica: parseInt(idUsuario),
      };

      const response = await fetch('/api/mascotas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mascotaData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Mascota creada exitosamente');
        setTimeout(() => {
          navigate('/listar-mascotas');
        }, 1500);
      } else {
        setError(typeof data === 'string' ? data : (data.message || 'Error al crear la mascota'));
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="ADMIN" />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/dashboard-admin')}>
            <i className="fas fa-arrow-left mr-2"></i>Volver al Dashboard
          </Button>
        </div>
        
        <div className="mb-8">
          <h1 className="text-4xl font-light text-gray-800 mb-2">Crear Nueva Mascota</h1>
          <p className="text-gray-500">Registra una nueva mascota en el sistema</p>
        </div>

        <Card className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Nombre *"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
              />

              <Input
                label="Especie *"
                name="especie"
                value={formData.especie}
                onChange={handleChange}
                placeholder="Perro, Gato, etc."
                required
              />

              <Input
                label="Raza"
                name="raza"
                value={formData.raza}
                onChange={handleChange}
              />

              <Input
                label="Edad"
                name="edad"
                type="number"
                value={formData.edad}
                onChange={handleChange}
                min="0"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sexo *</label>
                <select
                  name="sexo"
                  value={formData.sexo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 focus:outline-none focus:border-[#4ADE80] focus:bg-white focus:ring-4 focus:ring-[#4ADE80]/20"
                  required
                >
                  <option value="">Selecciona...</option>
                  <option value="MACHO">Macho</option>
                  <option value="HEMBRA">Hembra</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño</label>
                <select
                  name="tamano"
                  value={formData.tamano}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 focus:outline-none focus:border-[#4ADE80] focus:bg-white focus:ring-4 focus:ring-[#4ADE80]/20"
                >
                  <option value="">Selecciona...</option>
                  <option value="PEQUENO">Pequeño</option>
                  <option value="MEDIANO">Mediano</option>
                  <option value="GRANDE">Grande</option>
                  <option value="OTRO">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado de Publicación *</label>
                <select
                  name="statusPublicacion"
                  value={formData.statusPublicacion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 focus:outline-none focus:border-[#4ADE80] focus:bg-white focus:ring-4 focus:ring-[#4ADE80]/20"
                  required
                >
                  <option value="DISPONIBLE">Disponible</option>
                  <option value="RESERVADA">Reservada</option>
                  <option value="ADOPTADA">Adoptada</option>
                  <option value="NO_DISPONIBLE">No Disponible</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL de la Foto</label>
              <Input
                type="url"
                name="foto"
                value={formData.foto}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
              <p className="mt-1 text-xs text-gray-500">Ingresa la URL de la imagen de la mascota</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border-2 border-gray-200 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#4ADE80] focus:bg-white focus:ring-4 focus:ring-[#4ADE80]/20"
                placeholder="Describe la mascota..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Estado de Salud</label>
              <Input
                name="estadoSalud"
                value={formData.estadoSalud}
                onChange={handleChange}
                placeholder="Ej: Saludable, En tratamiento, etc."
              />
            </div>

            <div className="flex space-x-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="esterilizado"
                  checked={formData.esterilizado}
                  onChange={handleChange}
                  className="w-5 h-5 text-[#4ADE80] border-gray-300 rounded focus:ring-[#4ADE80]"
                />
                <span className="ml-2 text-gray-700">Esterilizado</span>
              </label>
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={loading}
              >
                {loading ? 'Creando...' : 'Crear Mascota'}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => navigate('/listar-mascotas')}
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

export default CrearMascota;

