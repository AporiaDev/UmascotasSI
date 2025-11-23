import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Card from '../components/Card';

const DashboardUsuario = () => {
  const navigate = useNavigate();
  const [adopciones, setAdopciones] = useState([]);
  const [loading, setLoading] = useState(true);

  // -----------------------------
  // 🔹 DONACIONES WOMPI – USA TU BACKEND REAL
  // -----------------------------
  const PUBLIC_KEY = "pub_prod_CVG61fiOVk8dpewC2F0oCKrlr7zpekg2";
  const [mostrarWidgetDonacion, setMostrarWidgetDonacion] = useState(false);
  const [montoDonacion, setMontoDonacion] = useState(20000);
  const [errorDonacion, setErrorDonacion] = useState('');

  const realizarDonacion = async (monto) => {
    if (!monto || isNaN(monto) || monto < 1000) {
      setErrorDonacion('Ingresa un monto válido (mínimo 1.000 COP)');
      return;
    }

    setErrorDonacion('');
    const amountInCents = monto * 100;
    const reference = `donacion-${Date.now()}`;

    try {
      // ✔ 1️⃣ Pedir firma al backend (ESTO YA EXISTE EN TU BACKEND)
      const res = await fetch("/api/wompi", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, amountInCents }),
      });

      if (!res.ok) {
        throw new Error("Error generando firma en el backend");
      }

      const { signature } = await res.json();

      if (!signature) {
        throw new Error("Firma no recibida del backend");
      }

      // ✔ 2️⃣ Construir URL de Wompi con firma correcta
      const url = `https://checkout.wompi.co/p/?public-key=${PUBLIC_KEY}` +
                  `&amount-in-cents=${amountInCents}` +
                  `&currency=COP&reference=${reference}` +
                  `&signature.integrity=${signature}`;

      // ✔ 3️⃣ Redirigir al checkout
      window.location.href = url;

    } catch (err) {
      console.error("Error en donación:", err);
      setErrorDonacion("Error procesando la donación. Intenta nuevamente.");
    }
  };
  // -----------------------------------------------------

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (rol !== 'USUARIO') {
      navigate('/');
      return;
    }

    const cargar = async () => {
      await cargarAdopciones();
    };
    cargar();

    const interval = setInterval(() => {
      cargar();
    }, 10000);

    return () => clearInterval(interval);
  }, [navigate]);

  const cargarAdopciones = async () => {
    try {
      const idUsuario = localStorage.getItem('idUsuario');
      const response = await fetch('/api/adopciones');
      if (response.ok) {
        const todasAdopciones = await response.json();

        const adopcionesValidas = [];
        for (const adopcion of todasAdopciones) {
          if (adopcion.mascota?.idMascota) {
            try {
              const mascotaResponse = await fetch(`/api/mascotas/${adopcion.mascota.idMascota}`);
              if (mascotaResponse.ok) {
                const mascota = await mascotaResponse.json();
                if (mascota.statusPublicacion === 'ADOPTADA') {
                  adopcionesValidas.push(adopcion);
                }
              }
            } catch (err) {
              console.error('Error verificando mascota:', err);
            }
          }
        }

        const idUsuarioLocal = localStorage.getItem('idUsuario');
        const misAdopciones = adopcionesValidas.filter(
          a =>
            a.usuarioAdoptante?.idUsuario?.toString() === idUsuarioLocal ||
            a.adoptante?.idUsuario?.toString() === idUsuarioLocal
        );

        setAdopciones(misAdopciones.slice(0, 6));
      }
    } catch (error) {
      console.error('Error cargando adopciones:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#22C55E] text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="USUARIO" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-light text-gray-800 mb-2">Mi Dashboard</h1>
            <p className="text-gray-500">Gestiona tus adopciones y solicitudes</p>
          </div>

          {/* 🔹 WIDGET DONAR */}
          <div className="relative">
            <button
              onClick={() => setMostrarWidgetDonacion(prev => !prev)}
              className="px-6 py-3 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-xl shadow-md font-medium transition-all"
            >
              ❤️ Donar
            </button>

            {mostrarWidgetDonacion && (
              <div className="absolute right-0 mt-3 w-72 bg-white p-6 rounded-xl shadow-lg z-50">
                <label className="block text-gray-700 font-medium mb-2">
                  Ingresa el valor a donar (COP)
                </label>

                <input
                  type="number"
                  min="1000"
                  step="500"
                  value={montoDonacion}
                  onChange={e => setMontoDonacion(Number(e.target.value))}
                  className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-[#22C55E]"
                  placeholder="Ej: 20000"
                />

                {errorDonacion && (
                  <div className="text-red-500 text-sm mb-2">{errorDonacion}</div>
                )}

                <button
                  onClick={() => realizarDonacion(montoDonacion)}
                  className="w-full py-2 bg-[#22C55E] hover:bg-[#16A34A] text-white rounded-lg font-medium transition-all"
                >
                  Realizar donación
                </button>

                <button
                  onClick={() => setMostrarWidgetDonacion(false)}
                  className="w-full mt-2 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-all"
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Cards principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/listar-mascotas')}>
            <div className="w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-paw text-[#22C55E] text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Ver Mascotas</h3>
            <p className="text-sm text-gray-500">Explora mascotas disponibles</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/adopciones')}>
            <div className="w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-heart text-[#22C55E] text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Mis Adopciones</h3>
            <p className="text-sm text-gray-500">Ver todas mis adopciones</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/listar-solicitudes')}>
            <div className="w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-file-alt text-[#22C55E] text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Mis Solicitudes</h3>
            <p className="text-sm text-gray-500">Estado de mis solicitudes</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/perfil')}>
            <div className="w-16 h-16 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-user text-[#22C55E] text-2xl"></i>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Mi Perfil</h3>
            <p className="text-sm text-gray-500">Ver mi información</p>
          </Card>
        </div>

        {/* Adopciones recientes */}
        <Card className="p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-800">Mis Adopciones Recientes</h2>
            <button
              onClick={() => navigate('/adopciones')}
              className="text-[#22C55E] hover:text-[#16A34A] font-medium flex items-center"
            >
              Ver todas <i className="fas fa-arrow-right ml-2"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {adopciones.length === 0 ? (
              <div className="col-span-3 text-center py-8 text-gray-400">
                No tienes adopciones aún. <br />
                <button
                  onClick={() => navigate('/listar-mascotas')}
                  className="text-[#22C55E] hover:text-[#16A34A] font-medium mt-2">
                  Ver mascotas disponibles →
                </button>
              </div>
            ) : (
              adopciones.map((adopcion) => (
                <div
                  key={adopcion.idAdopcion}
                  onClick={() => navigate(`/adopcion/${adopcion.idAdopcion}`)}
                  className="bg-gray-50 rounded-xl p-4 cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <div className="w-full h-32 bg-gray-200 rounded-lg mb-3 overflow-hidden">
                    {adopcion.mascota?.foto ? (
                      <img
                        src={adopcion.mascota.foto}
                        alt={adopcion.mascota.nombre}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}

                    <div className={`w-full h-full ${adopcion.mascota?.foto ? 'hidden' : 'flex'} items-center justify-center`}>
                      <i className="fas fa-paw text-gray-400 text-3xl"></i>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-800">
                    {adopcion.mascota?.nombre || 'Sin nombre'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {adopcion.mascota?.especie || 'N/A'}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    Adoptado el {new Date(adopcion.fechaAdopcion).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>

      </div>
    </div>
  );
};

export default DashboardUsuario;
