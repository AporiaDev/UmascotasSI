import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Button from '../components/Button';
import Card from '../components/Card';

const VerEncuesta = () => {
  const navigate = useNavigate();
  const { idEncuesta } = useParams();
  const [encuesta, setEncuesta] = useState(null);
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const rol = localStorage.getItem('rol');
    if (rol !== 'ADMIN') {
      navigate('/');
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
          } catch (e) {
            console.error('Error al parsear preguntas:', e);
          }
        }
        
        // Parsear respuestas desde JSON
        if (data.respuestas) {
          try {
            const respuestasParsed = JSON.parse(data.respuestas);
            setRespuestas(respuestasParsed);
          } catch (e) {
            console.error('Error al parsear respuestas:', e);
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

  const renderRespuesta = (pregunta, respuestaObj, index) => {
    if (!respuestaObj) {
      return <p className="text-gray-500 italic">Sin respuesta</p>;
    }

    const respuesta = respuestaObj.respuesta || '';
    
    switch (pregunta.tipo) {
      case 'si_no':
        return (
          <div className="flex items-center">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              respuesta.toLowerCase() === 'si' || respuesta.toLowerCase() === 'sí' || respuesta === 'true'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {respuesta}
            </span>
          </div>
        );
      case 'escala':
        const valor = parseInt(respuesta);
        return (
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <span
                  key={num}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    num <= valor
                      ? 'bg-[#22C55E] text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {num}
                </span>
              ))}
            </div>
            <span className="text-gray-600">({respuesta}/5)</span>
          </div>
        );
      default:
        return <p className="text-gray-800 whitespace-pre-wrap">{respuesta}</p>;
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-[#22C55E] text-xl">Cargando...</div>
      </div>
    );
  }

  if (error || !encuesta) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="ADMIN" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 text-center">
            <i className="fas fa-exclamation-triangle text-4xl text-red-500 mb-4"></i>
            <p className="text-red-600 mb-4">{error || 'Encuesta no encontrada'}</p>
            <Button onClick={() => navigate('/gestionar-encuestas')}>
              Volver a Gestionar Encuestas
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  if (encuesta.estado !== 'RESPONDIDA') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar userRole="ADMIN" />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="p-8 text-center">
            <i className="fas fa-info-circle text-4xl text-blue-500 mb-4"></i>
            <h2 className="text-2xl font-semibold mb-4">Encuesta no respondida</h2>
            <p className="text-gray-600 mb-6">
              Esta encuesta aún no ha sido respondida por el usuario.
            </p>
            <Button onClick={() => navigate('/gestionar-encuestas')}>
              Volver a Gestionar Encuestas
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userRole="ADMIN" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => navigate('/gestionar-encuestas')}>
            <i className="fas fa-arrow-left mr-2"></i>Volver a Gestionar Encuestas
          </Button>
        </div>

        <Card className="p-8">
          <div className="mb-6">
            <h1 className="text-4xl font-light text-gray-800 mb-2">Respuestas de la Encuesta</h1>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>
                <strong>Mascota:</strong> {encuesta.adopcion?.mascota?.nombre || 'N/A'}
              </span>
              <span>•</span>
              <span>
                <strong>Adoptante:</strong> {encuesta.adopcion?.adoptante?.nombreCompleto || 'N/A'}
              </span>
            </div>
            {encuesta.fechaRespuesta && (
              <p className="text-sm text-gray-500 mt-2">
                Fecha de respuesta: {new Date(encuesta.fechaRespuesta).toLocaleString('es-ES')}
              </p>
            )}
            {encuesta.alertaCritica && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 font-medium">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  Alerta Crítica: Esta encuesta contiene respuestas que requieren atención
                </p>
              </div>
            )}
          </div>

          <div className="space-y-6">
            {preguntas.map((pregunta, index) => {
              const respuestaObj = respuestas.find(r => 
                r.pregunta === pregunta.texto || 
                (respuestas[index] && respuestas[index].pregunta === pregunta.texto)
              ) || respuestas[index];

              return (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      Pregunta {index + 1}
                    </h3>
                    <p className="text-gray-700 mb-4">{pregunta.texto}</p>
                    <div className="text-sm text-gray-500 mb-3">
                      Tipo: {pregunta.tipo === 'si_no' ? 'Sí/No' : 
                             pregunta.tipo === 'escala' ? 'Escala 1-5' : 
                             'Texto libre'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-600 mb-2">Respuesta:</h4>
                    {renderRespuesta(pregunta, respuestaObj, index)}
                  </div>
                </div>
              );
            })}
          </div>

          {preguntas.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No hay preguntas en esta encuesta
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VerEncuesta;

