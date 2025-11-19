package com.example.umascota.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.umascota.model.usuario.Notificacion;
import com.example.umascota.model.usuario.Usuario;
import com.example.umascota.repository.NotificacionRepository;
import com.example.umascota.repository.UsuarioRepository;

import java.util.List;

@Service
public class NotificacionService {

    @Autowired
    private NotificacionRepository notificacionRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Crear notificación para un usuario específico
    public Notificacion crearNotificacion(Long idUsuario, String titulo, String mensaje, String tipo, Long idReferencia) {
        Usuario usuario = usuarioRepository.findByIdUsuario(idUsuario)
            .orElseThrow(() -> new IllegalArgumentException("Usuario no encontrado"));

        Notificacion notificacion = new Notificacion();
        notificacion.setUsuario(usuario);
        notificacion.setTitulo(titulo);
        notificacion.setMensaje(mensaje);
        notificacion.setTipo(tipo);
        notificacion.setIdReferencia(idReferencia);
        notificacion.setLeida(false);

        return notificacionRepository.save(notificacion);
    }

    // Crear notificaciones para todos los usuarios (excepto el que creó la mascota)
    @Transactional
    public void notificarNuevaMascota(Long idMascota, String nombreMascota, Long idUsuarioCreador) {
        List<Usuario> usuarios = usuarioRepository.findAll();
        
        for (Usuario usuario : usuarios) {
            // No notificar al usuario que creó la mascota
            if (usuario.getIdUsuario().equals(idUsuarioCreador)) {
                continue;
            }
            
            // Solo notificar a usuarios que tienen notificaciones habilitadas
            if (usuario.getNotificationsEnabled()) {
                crearNotificacion(
                    usuario.getIdUsuario(),
                    "Nueva Mascota Disponible",
                    "Se ha registrado una nueva mascota: " + nombreMascota,
                    "NUEVA_MASCOTA",
                    idMascota
                );
            }
        }
    }

    // Obtener todas las notificaciones de un usuario
    public List<Notificacion> obtenerNotificacionesUsuario(Long idUsuario) {
        return notificacionRepository.findByUsuarioIdUsuarioOrderByFechaCreacionDesc(idUsuario);
    }

    // Obtener notificaciones no leídas de un usuario
    public List<Notificacion> obtenerNotificacionesNoLeidas(Long idUsuario) {
        return notificacionRepository.findByUsuarioIdUsuarioAndLeidaFalseOrderByFechaCreacionDesc(idUsuario);
    }

    // Contar notificaciones no leídas
    public Long contarNotificacionesNoLeidas(Long idUsuario) {
        return notificacionRepository.countByUsuarioIdUsuarioAndLeidaFalse(idUsuario);
    }

    // Marcar notificación como leída
    public Notificacion marcarComoLeida(Long idNotificacion) {
        Notificacion notificacion = notificacionRepository.findById(idNotificacion)
            .orElseThrow(() -> new IllegalArgumentException("Notificación no encontrada"));
        
        notificacion.setLeida(true);
        return notificacionRepository.save(notificacion);
    }

    // Marcar todas las notificaciones de un usuario como leídas
    @Transactional
    public void marcarTodasComoLeidas(Long idUsuario) {
        List<Notificacion> notificaciones = obtenerNotificacionesNoLeidas(idUsuario);
        for (Notificacion notificacion : notificaciones) {
            notificacion.setLeida(true);
            notificacionRepository.save(notificacion);
        }
    }
}

