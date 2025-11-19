import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

const GestionarEncuestas = () => {
  const navigate = useNavigate();
  const [adopciones, setAdopciones] = useState([]);
  const [encuestas, setEncuestas] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [adopcionSeleccionada, setAdopcionSeleccionada] = useState(null);
  const [preguntas, setPreguntas] = useState([
    { id: 1, texto: '', tipo: 'texto' }
  ]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (rol !== 'ADMIN') {
      navigate('/');
      return;
    }
    cargarDatos();
  }, [navigate]);

  const cargarDatos = async () => {
    try {
      const [adopcionesRes, encuestasRes] = await Promise.all([
        fetch('/api/adopciones'),
        fetch('/api/encuestas')
      ]);

      if (adopcionesRes.ok) {
        const data = await adopcionesRes.json();
        setAdopciones(data);
      }

      if (encuestasRes.ok) {
        const data = await encuestasRes.json();
        setEncuestas(data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  const agregarPregunta = () => {
    setPreguntas([...preguntas, { id: Date.now(), texto: '', tipo: 'texto' }]);
  };

  const eliminarPregunta = (id) => {
    setPreguntas(preguntas.filter(p => p.id !== id));
  };

  const actualizarPregunta = (id, campo, valor) => {
    setPreguntas(preguntas.map(p => 
      p.id === id ? { ...p, [campo]: valor } : p
    ));
  };

  const crearEncuesta = async () => {
    if (!adopcionSeleccionada) {
      setError('Selecciona una adopción');
      return;
    }

    const preguntasValidas = preguntas.filter(p => p.texto.trim() !== '');
    if (preguntasValidas.length === 0) {
      setError('Agrega al menos una pregunta');
      return;
    }

    setCargando(true);
    setError('');
    setSuccess('');

    try {
      const preguntasJson = JSON.stringify(preguntasValidas);
      const fechaCreacionLocal = new Date().toISOString();
      
      const response = await fetch('/api/encuestas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idAdopcion: adopcionSeleccionada,
          preguntas: preguntasJson,
          fechaEnvio: fechaCreacionLocal,
          zonaHoraria: Intl.DateTimeFormat().resolvedOptions().timeZone
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Encuesta creada exitosamente');
        setMostrarFormulario(false);
        setPreguntas([{ id: 1, texto: '', tipo: 'texto' }]);
        setAdopcionSeleccionada(null);
        cargarDatos();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(typeof data === 'string' ? data : (data.message || 'Error al crear la encuesta'));
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setCargando(false);
    }
  };

  const enviarEncuesta = async (idEncuesta) => {
    if (!window.confirm('¿Estás seguro de enviar esta encuesta al usuario?')) {
      return;
    }

    try {
      const response = await fetch(`/api/encuestas/${idEncuesta}/enviar`, {
        method: 'PUT'
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Encuesta enviada exitosamente');
        cargarDatos();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(typeof data === 'string' ? data : (data.message || 'Error al enviar la encuesta'));
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.');
    }
  };

  const getEstadoBadge = (estado) => {
    const badges = {
      'PENDIENTE': 'bg-yellow-100 text-yellow-800',
      'ENVIADA': 'bg-blue-100 text-blue-800',
      'RESPONDIDA': 'bg-green-100 text-green-800',
      'CANCELADA': 'bg-red-100 text-red-800'
    };
    return badges[estado] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="ADMIN" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-light text-gray-800 mb-2">Gestionar Encuestas</h1>
            <p className="text-gray-500">Crea y envía encuestas post-adopción</p>
          </div>
          <Button onClick={() => setMostrarFormulario(!mostrarFormulario)}>
            <i className="fas fa-plus mr-2"></i>
            {mostrarFormulario ? 'Cancelar' : 'Nueva Encuesta'}
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {mostrarFormulario && (
          <Card className="mb-8 p-6">
            <h2 className="text-2xl font-semibold mb-4">Crear Nueva Encuesta</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seleccionar Adopción
              </label>
              <select
                value={adopcionSeleccionada || ''}
                onChange={(e) => setAdopcionSeleccionada(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#22C55E] focus:border-transparent"
              >
                <option value="">Selecciona una adopción</option>
                {adopciones.map(adopcion => (
                  <option key={adopcion.idAdopcion} value={adopcion.idAdopcion}>
                    {adopcion.mascota?.nombre || 'Mascota'} - {adopcion.adoptante?.nombreCompleto || 'Usuario'}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Preguntas
                </label>
                <Button variant="outline" onClick={agregarPregunta} size="sm">
                  <i className="fas fa-plus mr-1"></i>Agregar Pregunta
                </Button>
              </div>
              
              {preguntas.map((pregunta, index) => (
                <div key={pregunta.id} className="mb-3 p-4 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium text-gray-600">Pregunta {index + 1}</span>
                    {preguntas.length > 1 && (
                      <button
                        onClick={() => eliminarPregunta(pregunta.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                  <Input
                    value={pregunta.texto}
                    onChange={(e) => actualizarPregunta(pregunta.id, 'texto', e.target.value)}
                    placeholder="Escribe la pregunta aquí..."
                    className="mb-2"
                  />
                  <select
                    value={pregunta.tipo}
                    onChange={(e) => actualizarPregunta(pregunta.id, 'tipo', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  >
                    <option value="texto">Texto libre</option>
                    <option value="si_no">Sí/No</option>
                    <option value="escala">Escala 1-5</option>
                  </select>
                </div>
              ))}
            </div>

            <div className="flex justify-end space-x-3">
              <Button variant="outline" onClick={() => {
                setMostrarFormulario(false);
                setPreguntas([{ id: 1, texto: '', tipo: 'texto' }]);
                setAdopcionSeleccionada(null);
              }}>
                Cancelar
              </Button>
              <Button onClick={crearEncuesta} disabled={cargando}>
                {cargando ? 'Creando...' : 'Crear Encuesta'}
              </Button>
            </div>
          </Card>
        )}

        <div className="grid grid-cols-1 gap-6">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Encuestas</h2>
            
            {encuestas.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay encuestas creadas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mascota</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Adoptante</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha Envío</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {encuestas.map(encuesta => (
                      <tr key={encuesta.idEncuesta}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {encuesta.adopcion?.mascota?.nombre || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {encuesta.adopcion?.adoptante?.nombreCompleto || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getEstadoBadge(encuesta.estado)}`}>
                            {encuesta.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {encuesta.fechaEnvio 
                            ? new Date(encuesta.fechaEnvio).toLocaleDateString('es-ES')
                            : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {encuesta.estado === 'PENDIENTE' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => enviarEncuesta(encuesta.idEncuesta)}
                            >
                              <i className="fas fa-paper-plane mr-1"></i>Enviar
                            </Button>
                          )}
                          {encuesta.estado === 'RESPONDIDA' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/ver-encuesta/${encuesta.idEncuesta}`)}
                            >
                              <i className="fas fa-eye mr-1"></i>Ver Respuestas
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GestionarEncuestas;

