package com.example.umascota.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.umascota.model.adopcion.EncuestaPostAdopcion;
import com.example.umascota.service.EncuestaService;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/encuestas")
public class EncuestaController {

    private final EncuestaService encuestaService;

    public EncuestaController(EncuestaService encuestaService) {
        this.encuestaService = encuestaService;
    }

    // POST - Crear encuesta (solo admin)
    @PostMapping
    public ResponseEntity<?> crearEncuesta(@RequestBody Map<String, Object> request) {
        try {
            Long idAdopcion = Long.valueOf(request.get("idAdopcion").toString());
            String preguntas = (String) request.get("preguntas");
            
            if (preguntas == null || preguntas.isEmpty()) {
                return ResponseEntity.badRequest().body("Las preguntas son requeridas");
            }

            EncuestaPostAdopcion encuesta = encuestaService.crearEncuesta(idAdopcion, preguntas);
            return ResponseEntity.ok(encuesta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al crear la encuesta: " + e.getMessage());
        }
    }

    // PUT - Enviar encuesta (solo admin)
    @PutMapping("/{idEncuesta}/enviar")
    public ResponseEntity<?> enviarEncuesta(@PathVariable Long idEncuesta) {
        try {
            EncuestaPostAdopcion encuesta = encuestaService.enviarEncuesta(idEncuesta);
            return ResponseEntity.ok(encuesta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al enviar la encuesta: " + e.getMessage());
        }
    }

    // PUT - Responder encuesta
    @PutMapping("/{idEncuesta}/responder")
    public ResponseEntity<?> responderEncuesta(
            @PathVariable Long idEncuesta,
            @RequestBody Map<String, Object> request) {
        try {
            String respuestas = (String) request.get("respuestas");
            Long idUsuario = Long.valueOf(request.get("idUsuario").toString());

            if (respuestas == null || respuestas.isEmpty()) {
                return ResponseEntity.badRequest().body("Las respuestas son requeridas");
            }

            EncuestaPostAdopcion encuesta = encuestaService.responderEncuesta(idEncuesta, respuestas, idUsuario);
            return ResponseEntity.ok(encuesta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al responder la encuesta: " + e.getMessage());
        }
    }

    // GET - Obtener todas las encuestas (admin)
    @GetMapping
    public ResponseEntity<List<EncuestaPostAdopcion>> obtenerTodas() {
        List<EncuestaPostAdopcion> encuestas = encuestaService.obtenerTodas();
        return ResponseEntity.ok(encuestas);
    }

    // GET - Obtener encuestas por estado
    @GetMapping("/estado/{estado}")
    public ResponseEntity<List<EncuestaPostAdopcion>> obtenerPorEstado(@PathVariable String estado) {
        List<EncuestaPostAdopcion> encuestas = encuestaService.obtenerPorEstado(estado);
        return ResponseEntity.ok(encuestas);
    }

    // GET - Obtener encuesta por ID
    @GetMapping("/{idEncuesta}")
    public ResponseEntity<?> obtenerPorId(@PathVariable Long idEncuesta) {
        Optional<EncuestaPostAdopcion> encuesta = encuestaService.obtenerPorId(idEncuesta);
        if (encuesta.isPresent()) {
            return ResponseEntity.ok(encuesta.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // GET - Obtener encuestas de un usuario
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<List<EncuestaPostAdopcion>> obtenerEncuestasUsuario(@PathVariable Long idUsuario) {
        List<EncuestaPostAdopcion> encuestas = encuestaService.obtenerEncuestasUsuario(idUsuario);
        return ResponseEntity.ok(encuestas);
    }

    // GET - Obtener encuestas pendientes de un usuario
    @GetMapping("/usuario/{idUsuario}/pendientes")
    public ResponseEntity<List<EncuestaPostAdopcion>> obtenerEncuestasPendientes(@PathVariable Long idUsuario) {
        List<EncuestaPostAdopcion> encuestas = encuestaService.obtenerEncuestasPendientesUsuario(idUsuario);
        return ResponseEntity.ok(encuestas);
    }
}

