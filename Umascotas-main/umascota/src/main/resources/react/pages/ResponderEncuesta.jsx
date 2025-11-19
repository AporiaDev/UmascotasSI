import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

const ResponderEncuesta = () => {
  const navigate = useNavigate();
  const { idEncuesta } = useParams();
  const [encuesta, setEncuesta] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    const idUsuario = localStorage.getItem('idUsuario');
    
    if (!rol || !idUsuario) {
      navigate('/login');
      return;
    }
    
    cargarEncuesta();
  }, [idEncuesta, navigate]);

  const cargarEncuesta = async () => {
    try {
      const response = await fetch(`/api/encuestas/${idEncuesta}`);
      if (response.ok) {
        const data = await response.json();
        setEncuesta(data);
        
        // Parsear preguntas desde JSON
        if (data.preguntas) {
          try {
            const preguntasParsed = JSON.parse(data.preguntas);
            setPreguntas(preguntasParsed);
            
            // Inicializar respuestas vacías
            const respuestasIniciales = {};
            preguntasParsed.forEach((p, index) => {
              respuestasIniciales[index] = '';
            });
            setRespuestas(respuestasIniciales);
          } catch (e) {
            console.error('Error al parsear preguntas:', e);
          }
        }
      } else {
        setError('Encuesta no encontrada');
      }
    } catch (error) {
      console.error('Error al cargar encuesta:', error);
      setError('Error al cargar la encuesta');
    } finally {
      setCargando(false);
    }
  };

  const handleRespuestaChange = (index, valor) => {
    setRespuestas(prev => ({
      ...prev,
      [index]: valor
    }));
  };

  const enviarRespuestas = async () => {
    // Validar que todas las preguntas tengan respuesta
    const todasRespondidas = preguntas.every((_, index) => {
      const respuesta = respuestas[index];
      return respuesta !== undefined && respuesta !== null && respuesta !== '';
    });

    if (!todasRespondidas) {
      setError('Por favor, responde todas las preguntas');
      return;
    }

    setEnviando(true);
    setError('');
    setSuccess('');

    try {
      const idUsuario = localStorage.getItem('idUsuario');
      
      // Construir objeto de respuestas
      const respuestasObj = preguntas.map((pregunta, index) => ({
        pregunta: pregunta.texto,
        tipo: pregunta.tipo,
        respuesta: respuestas[index]
      }));

      const respuestasJson = JSON.stringify(respuestasObj);

      const response = await fetch(`/api/encuestas/${idEncuesta}/responder`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          idUsuario: idUsuario,
          respuestas: respuestasJson
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('¡Gracias por responder la encuesta!');
        setTimeout(() => {
          navigate('/adopciones');
        }, 2000);
      } else {
        setError(typeof data === 'string' ? data : (data.message || 'Error al enviar las respuestas'));
      }
    } catch (err) {
      setError('Error de conexión. Por favor, intenta nuevamente.');
    } finally {
      setEnviando(false);
    }
  };

  const renderInputPregunta = (pregunta, index) => {
    const valor = respuestas[index] || '';

    switch (pregunta.tipo) {
      case 'si_no':
        return (
          <div className="flex space-x-4">
            <label className="flex items-center">
              <input
                type="radio"
                name={`pregunta-${index}`}
                value="Sí"
                checked={valor === 'Sí'}
                onChange={(e) => handleRespuestaChange(index, e.target.value)}
                className="mr-2"
              />
              Sí
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name={`pregunta-${index}`}
                value="No"
                checked={valor === 'No'}
                onChange={(e) => handleRespuestaChange(index, e.target.value)}
                className="mr-2"
              />
              No
            </label>
          </div>
        );
      
      case 'escala':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">1</span>
            <input
              type="range"
              min="1"
              max="5"
              value={valor || 3}
              onChange={(e) => handleRespuestaChange(index, e.target.value)}
              className="flex-1"
            />
            <span className="text-sm text-gray-600">5</span>
            <span className="text-sm font-medium text-[#22C55E] ml-2">
              {valor || 3}
            </span>
          </div>
        );
      
      default:
        return (
          <Input
            value={valor}
            onChange={(e) => handleRespuestaChange(index, e.target.value)}
            placeholder="Escribe tu respuesta aquí..."
            multiline
            rows={4}
          />
        );
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole={localStorage.getItem('rol')} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <i className="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
          <p className="mt-4 text-gray-500">Cargando encuesta...</p>
        </div>
      </div>
    );
  }

  if (error && !encuesta) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole={localStorage.getItem('rol')} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 text-center">
            <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => navigate('/adopciones')}>
              Volver a Mis Adopciones
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (encuesta?.estado === 'RESPONDIDA') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole={localStorage.getItem('rol')} />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 text-center">
            <i className="fas fa-check-circle text-4xl text-green-500 mb-4"></i>
            <h2 className="text-2xl font-semibold mb-4">Encuesta ya respondida</h2>
            <p className="text-gray-600 mb-6">
              Ya has respondido esta encuesta anteriormente.
            </p>
            <Button onClick={() => navigate('/adopciones')}>
              Volver a Mis Adopciones
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole={localStorage.getItem('rol')} />
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/adopciones')}>
            <i className="fas fa-arrow-left mr-2"></i>Volver
          </Button>
        </div>

        <Card className="p-8">
          <div className="mb-6">
            <h1 className="text-4xl font-light text-gray-800 mb-2">Encuesta Post-Adopción</h1>
            {encuesta?.adopcion?.mascota && (
              <p className="text-gray-500">
                Sobre la adopción de <strong>{encuesta.adopcion.mascota.nombre}</strong>
              </p>
            )}
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

          <div className="space-y-6">
            {preguntas.map((pregunta, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <label className="block text-lg font-medium text-gray-800 mb-3">
                  {index + 1}. {pregunta.texto}
                </label>
                {renderInputPregunta(pregunta, index)}
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <Button variant="outline" onClick={() => navigate('/adopciones')}>
              Cancelar
            </Button>
            <Button onClick={enviarRespuestas} disabled={enviando}>
              {enviando ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>Enviando...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>Enviar Respuestas
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ResponderEncuesta;

