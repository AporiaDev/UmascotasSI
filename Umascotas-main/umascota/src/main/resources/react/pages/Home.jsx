import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import Button from '../components/Button';
import Card from '../components/Card';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative overflow-hidden immersive-gradient-radial">
      {/* Efectos de fondo inmersivos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-green-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="max-w-5xl w-full text-center">
          {/* Logo y Título */}
          <div className="mb-12 fade-in">
            <div className="mb-8 flex justify-center">
              <div className="glow-green pulse-green">
                <Logo size={140} />
              </div>
            </div>
            <h1 className="text-7xl md:text-8xl font-light text-white mb-6 tracking-tight drop-shadow-2xl">
              Bienvenido a U-Mascota
            </h1>
            <p className="text-2xl md:text-3xl text-white/95 font-light max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
              Conectamos corazones con patas. Encuentra tu compañero perfecto o ayuda a una mascota a encontrar su hogar.
            </p>
          </div>

          {/* Botones de Acción */}
          <div className="space-y-5 max-w-md mx-auto mb-20 slide-up">
            <Button
              variant="ghost"
              size="xl"
              className="w-full glow-green hover:scale-105 transition-transform duration-300"
              onClick={() => navigate('/login')}
            >
              <span className="text-lg font-medium">Iniciar Sesión</span>
            </Button>
            <Button
              variant="secondary"
              size="xl"
              className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-md border-2 border-white/40 hover:scale-105 transition-transform duration-300"
              onClick={() => navigate('/registro')}
            >
              <span className="text-lg font-medium">Crear Cuenta</span>
            </Button>
          </div>

          {/* Características */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto slide-up">
            <Card variant="glass-green" className="p-8 text-center hover:scale-105 transition-transform duration-300 glow-green">
              <div className="text-6xl mb-6 floating-animation">🐾</div>
              <h3 className="font-bold text-white mb-3 text-xl">Adopción Segura</h3>
              <p className="text-base text-white/90 font-light">Proceso verificado y confiable para garantizar el bienestar</p>
            </Card>
            
            <Card variant="glass-green" className="p-8 text-center hover:scale-105 transition-transform duration-300 glow-green" style={{ animationDelay: '0.2s' }}>
              <div className="text-6xl mb-6 floating-animation" style={{ animationDelay: '0.2s' }}>❤️</div>
              <h3 className="font-bold text-white mb-3 text-xl">Amor Incondicional</h3>
              <p className="text-base text-white/90 font-light">Cada mascota busca un hogar lleno de amor y cuidado</p>
            </Card>
            
            <Card variant="glass-green" className="p-8 text-center hover:scale-105 transition-transform duration-300 glow-green" style={{ animationDelay: '0.4s' }}>
              <div className="text-6xl mb-6 floating-animation" style={{ animationDelay: '0.4s' }}>🏠</div>
              <h3 className="font-bold text-white mb-3 text-xl">Hogar Perfecto</h3>
              <p className="text-base text-white/90 font-light">Encuentra tu compañero ideal para toda la vida</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

