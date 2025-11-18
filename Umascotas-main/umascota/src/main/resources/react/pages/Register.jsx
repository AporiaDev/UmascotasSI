import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    correoElectronico: '',
    contrasena: '',
    confirmarContrasena: '',
    telefono: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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

    if (formData.contrasena !== formData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/auth/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombreCompleto: formData.nombre,
          correoElectronico: formData.correoElectronico,
          contrasena: formData.contrasena,
          telefono: formData.telefono,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirigir al login después del registro exitoso
        navigate('/login', { state: { message: 'Cuenta creada exitosamente. Por favor, inicia sesión.' } });
      } else {
        // El backend puede devolver un string o un objeto con message
        setError(typeof data === 'string' ? data : (data.message || 'Error al crear la cuenta'));
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4ADE80] via-[#22C55E] to-[#16A34A] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 fade-in">
          <Link to="/" className="inline-block">
            <Logo size={80} />
          </Link>
        </div>

        {/* Formulario */}
        <Card variant="glass" className="p-8 shadow-2xl slide-up">
          <h1 className="text-3xl font-light text-gray-800 mb-2 text-center">
            Crear Cuenta
          </h1>
          <p className="text-gray-600 text-center mb-8 text-sm">
            Únete a nuestra comunidad de amantes de las mascotas
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Nombre Completo"
              type="text"
              name="nombre"
              placeholder="Juan Pérez"
              value={formData.nombre}
              onChange={handleChange}
              required
            />

            <Input
              label="Correo Electrónico"
              type="email"
              name="correoElectronico"
              placeholder="tu@email.com"
              value={formData.correoElectronico}
              onChange={handleChange}
              required
            />

            <Input
              label="Teléfono"
              type="tel"
              name="telefono"
              placeholder="+57 300 123 4567"
              value={formData.telefono}
              onChange={handleChange}
            />

            <Input
              label="Contraseña"
              type="password"
              name="contrasena"
              placeholder="••••••••"
              value={formData.contrasena}
              onChange={handleChange}
              required
            />

            <Input
              label="Confirmar Contraseña"
              type="password"
              name="confirmarContrasena"
              placeholder="••••••••"
              value={formData.confirmarContrasena}
              onChange={handleChange}
              required
            />

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </Button>
          </form>

          {/* Enlaces */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{' '}
              <Link
                to="/login"
                className="text-[#22C55E] font-medium hover:text-[#16A34A] transition-colors"
              >
                Iniciar sesión
              </Link>
            </p>
            <Link
              to="/"
              className="block text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Volver al inicio
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;

