import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  const googleButtonRef = useRef(null);

  const handleGoogleSignIn = useCallback(async (response) => {
    setLoading(true);
    setError('');

    try {
      const backendResponse = await fetch('/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken: response.credential }),
      });

      const data = await backendResponse.json();

      if (backendResponse.ok) {
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
        setError(data.message || 'Error al autenticar con Google');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }

    // Función para inicializar Google Sign-In
    const initializeGoogleSignIn = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
      
      console.log('Inicializando Google Sign-In...');
      console.log('Client ID disponible:', clientId ? 'Sí' : 'No');
      
      if (!clientId) {
        console.error('VITE_GOOGLE_CLIENT_ID no está configurado');
        // Mostrar mensaje visual si no hay clientId
        if (googleButtonRef.current) {
          googleButtonRef.current.innerHTML = '<p className="text-sm text-gray-500 text-center">Google Sign-In no disponible</p>';
        }
        return;
      }

      if (!window.google) {
        console.warn('Google Identity Services no está cargado');
        return;
      }

      if (!googleButtonRef.current) {
        console.warn('Ref del botón de Google no está disponible');
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleSignIn,
        });

        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: 'outline',
            size: 'large',
            width: '100%',
            text: 'signin_with',
            locale: 'es',
          }
        );
        console.log('Botón de Google renderizado correctamente');
      } catch (error) {
        console.error('Error al renderizar botón de Google:', error);
      }
    };

    // Esperar a que el script de Google se cargue
    if (window.google && window.google.accounts && window.google.accounts.id) {
      // Script ya cargado
      setTimeout(initializeGoogleSignIn, 100);
    } else {
      // Si el script aún no está cargado, esperar
      let attempts = 0;
      const maxAttempts = 50; // 5 segundos máximo
      
      const checkGoogle = setInterval(() => {
        attempts++;
        if (window.google && window.google.accounts && window.google.accounts.id) {
          initializeGoogleSignIn();
          clearInterval(checkGoogle);
        } else if (attempts >= maxAttempts) {
          console.error('Timeout: Google Identity Services no se cargó después de 5 segundos');
          clearInterval(checkGoogle);
        }
      }, 100);
    }
  }, [location, handleGoogleSignIn]);

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

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">O continúa con</span>
            </div>
          </div>

          {/* Google Sign-In Button */}
          <div ref={googleButtonRef} className="w-full flex justify-center"></div>

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

