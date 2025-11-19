package com.example.umascota.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.umascota.model.usuario.Notificacion;
import com.example.umascota.service.NotificacionService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notificaciones")
public class NotificacionController {

    private final NotificacionService notificacionService;

    public NotificacionController(NotificacionService notificacionService) {
        this.notificacionService = notificacionService;
    }

    // GET - Obtener todas las notificaciones del usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<Notificacion>> obtenerNotificaciones(@PathVariable Long idUsuario) {
        List<Notificacion> notificaciones = notificacionService.obtenerNotificacionesUsuario(idUsuario);
        return ResponseEntity.ok(notificaciones);
    }

    // GET - Obtener notificaciones no leídas del usuario
    @GetMapping("/usuario/{idUsuario}/no-leidas")
    public ResponseEntity<List<Notificacion>> obtenerNotificacionesNoLeidas(@PathVariable Long idUsuario) {
        List<Notificacion> notificaciones = notificacionService.obtenerNotificacionesNoLeidas(idUsuario);
        return ResponseEntity.ok(notificaciones);
    }

    // GET - Contar notificaciones no leídas
    @GetMapping("/usuario/{idUsuario}/contar")
    public ResponseEntity<Map<String, Long>> contarNotificacionesNoLeidas(@PathVariable Long idUsuario) {
        Long count = notificacionService.contarNotificacionesNoLeidas(idUsuario);
        return ResponseEntity.ok(Map.of("count", count));
    }

    // PUT - Marcar notificación como leída
    @PutMapping("/{idNotificacion}/leida")
    public ResponseEntity<?> marcarComoLeida(@PathVariable Long idNotificacion) {
        try {
            Notificacion notificacion = notificacionService.marcarComoLeida(idNotificacion);
            return ResponseEntity.ok(notificacion);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT - Marcar todas las notificaciones como leídas
    @PutMapping("/usuario/{idUsuario}/marcar-todas-leidas")
    public ResponseEntity<?> marcarTodasComoLeidas(@PathVariable Long idUsuario) {
        try {
            notificacionService.marcarTodasComoLeidas(idUsuario);
            return ResponseEntity.ok(Map.of("mensaje", "Todas las notificaciones han sido marcadas como leídas"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error al marcar notificaciones: " + e.getMessage());
        }
    }
}

