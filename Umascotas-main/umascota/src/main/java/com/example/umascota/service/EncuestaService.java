package com.example.umascota.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.umascota.model.adopcion.Adopcion;
import com.example.umascota.model.adopcion.EncuestaPostAdopcion;
import com.example.umascota.repository.AdopcionRepository;
import com.example.umascota.repository.EncuestaRepository;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Optional;

@Service
public class EncuestaService {

    @Autowired
    private EncuestaRepository encuestaRepository;

    @Autowired
    private AdopcionRepository adopcionRepository;

    @Autowired
    private NotificacionService notificacionService;

    // Crear encuesta para una adopción
    @Transactional
    public EncuestaPostAdopcion crearEncuesta(Long idAdopcion, String preguntasJson, String fechaEnvioIso) {
        Optional<Adopcion> adopcionOpt = adopcionRepository.findById(idAdopcion);
        
        if (adopcionOpt.isEmpty()) {
            throw new IllegalArgumentException("Adopción no encontrada");
        }

        Adopcion adopcion = adopcionOpt.get();

        // Verificar si ya existe una encuesta para esta adopción
        List<EncuestaPostAdopcion> encuestasExistentes = encuestaRepository.findByAdopcionIdAdopcion(idAdopcion);
        if (!encuestasExistentes.isEmpty()) {
            throw new IllegalArgumentException("Ya existe una encuesta para esta adopción");
        }

        EncuestaPostAdopcion encuesta = new EncuestaPostAdopcion();
        encuesta.setAdopcion(adopcion);
        encuesta.setSolicitud(adopcion.getSolicitud());
        encuesta.setPreguntas(preguntasJson);
        encuesta.setEstado("PENDIENTE");
        encuesta.setAlertaCritica(false);
        encuesta.setFechaEnvio(parsearFechaEnvio(fechaEnvioIso));
        encuesta.setFechaRespuesta(null);
        encuesta.setRespuestas(null);

        return encuestaRepository.save(encuesta);
    }

    private Timestamp parsearFechaEnvio(String fechaEnvioIso) {
        if (fechaEnvioIso == null || fechaEnvioIso.isBlank()) {
            return new Timestamp(System.currentTimeMillis());
        }
        try {
            Instant instant = Instant.parse(fechaEnvioIso);
            return Timestamp.from(instant);
        } catch (DateTimeParseException e) {
            return new Timestamp(System.currentTimeMillis());
        }
    }

    // Enviar encuesta al usuario (cambiar estado a ENVIADA y crear notificación)
    @Transactional
    public EncuestaPostAdopcion enviarEncuesta(Long idEncuesta) {
        Optional<EncuestaPostAdopcion> encuestaOpt = encuestaRepository.findById(idEncuesta);
        
        if (encuestaOpt.isEmpty()) {
            throw new IllegalArgumentException("Encuesta no encontrada");
        }

        EncuestaPostAdopcion encuesta = encuestaOpt.get();

        if (!"PENDIENTE".equals(encuesta.getEstado())) {
            throw new IllegalArgumentException("Solo se pueden enviar encuestas en estado PENDIENTE");
        }

        encuesta.setEstado("ENVIADA");
        encuesta.setFechaEnvio(new java.sql.Timestamp(System.currentTimeMillis()));

        EncuestaPostAdopcion encuestaGuardada = encuestaRepository.save(encuesta);

        // Crear notificación para el usuario
        try {
            Long idUsuario = encuesta.getAdopcion().getAdoptante().getIdUsuario();
            String nombreMascota = encuesta.getAdopcion().getMascota().getNombre();
            
            notificacionService.crearNotificacion(
                idUsuario,
                "Encuesta Post-Adopción",
                "Tienes una encuesta pendiente sobre la adopción de " + nombreMascota,
                "ENCUESTA",
                idEncuesta
            );
        } catch (Exception e) {
            System.err.println("Error al crear notificación de encuesta: " + e.getMessage());
        }

        return encuestaGuardada;
    }

    // Responder encuesta
    @Transactional
    public EncuestaPostAdopcion responderEncuesta(Long idEncuesta, String respuestasJson, Long idUsuario) {
        Optional<EncuestaPostAdopcion> encuestaOpt = encuestaRepository.findById(idEncuesta);
        
        if (encuestaOpt.isEmpty()) {
            throw new IllegalArgumentException("Encuesta no encontrada");
        }

        EncuestaPostAdopcion encuesta = encuestaOpt.get();

        // Verificar que el usuario es el adoptante
        if (!encuesta.getAdopcion().getAdoptante().getIdUsuario().equals(idUsuario)) {
            throw new IllegalArgumentException("No tienes permiso para responder esta encuesta");
        }

        if (!"ENVIADA".equals(encuesta.getEstado())) {
            throw new IllegalArgumentException("Solo se pueden responder encuestas en estado ENVIADA");
        }

        encuesta.setEstado("RESPONDIDA");
        encuesta.setRespuestas(respuestasJson);
        encuesta.setFechaRespuesta(new java.sql.Timestamp(System.currentTimeMillis()));

        // Evaluar si hay alerta crítica (por ejemplo, si alguna respuesta indica problemas)
        // Aquí puedes agregar lógica para detectar alertas críticas basadas en las respuestas
        encuesta.setAlertaCritica(evaluarAlertaCritica(respuestasJson));

        return encuestaRepository.save(encuesta);
    }

    // Obtener todas las encuestas
    public List<EncuestaPostAdopcion> obtenerTodas() {
        return encuestaRepository.findAll();
    }

    // Obtener encuestas por estado
    public List<EncuestaPostAdopcion> obtenerPorEstado(String estado) {
        return encuestaRepository.findByEstado(estado);
    }

    // Obtener encuesta por ID
    public Optional<EncuestaPostAdopcion> obtenerPorId(Long idEncuesta) {
        return encuestaRepository.findById(idEncuesta);
    }

    // Obtener encuestas de un usuario
    public List<EncuestaPostAdopcion> obtenerEncuestasUsuario(Long idUsuario) {
        return encuestaRepository.findByAdopcionAdoptanteIdUsuario(idUsuario);
    }

    // Obtener encuestas pendientes de un usuario
    public List<EncuestaPostAdopcion> obtenerEncuestasPendientesUsuario(Long idUsuario) {
        return encuestaRepository.findByAdopcionAdoptanteIdUsuarioAndEstado(idUsuario, "ENVIADA");
    }

    // Método auxiliar para evaluar alertas críticas
    private boolean evaluarAlertaCritica(String respuestasJson) {
        // Implementar lógica para detectar alertas críticas
        // Por ejemplo, buscar palabras clave o valores específicos en las respuestas
        if (respuestasJson == null || respuestasJson.isEmpty()) {
            return false;
        }
        
        // Ejemplo simple: buscar indicadores de problemas
        String lowerJson = respuestasJson.toLowerCase();
        return lowerJson.contains("\"problema\":true") || 
               lowerJson.contains("\"alerta\":true") ||
               lowerJson.contains("\"critico\":true");
    }
}

