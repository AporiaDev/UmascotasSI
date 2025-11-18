import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({
    correoElectronico: '',
    contrasena: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

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

    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('rol', data.rol);
        localStorage.setItem('idUsuario', data.idUsuario);
        // Redirigir según el rol
        if (data.rol === 'ADMIN') {
          window.location.href = '/dashboard-admin';
        } else {
          window.location.href = '/dashboard-usuario';
        }
      } else {
        setError(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4ADE80] via-[#22C55E] to-[#16A34A] flex items-center justify-center p-4">
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
            Iniciar Sesión
          </h1>
          <p className="text-gray-600 text-center mb-8 text-sm">
            Ingresa a tu cuenta para continuar
          </p>

          {successMessage && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm text-center mb-4">
              {successMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
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
              label="Contraseña"
              type="password"
              name="contrasena"
              placeholder="••••••••"
              value={formData.contrasena}
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
              {loading ? 'Iniciando sesión...' : 'Continuar'}
            </Button>
          </form>

          {/* Enlaces */}
          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              ¿No tienes cuenta?{' '}
              <Link
                to="/registro"
                className="text-[#22C55E] font-medium hover:text-[#16A34A] transition-colors"
              >
                Crear cuenta
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

export default Login;

