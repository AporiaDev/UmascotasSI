package com.example.umascota.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.umascota.model.adopcion.SolicitudAdopcion;
import com.example.umascota.service.SolicitudService;

@RestController
@RequestMapping("/api/solicitudes")
public class SolicitudController {

    private final SolicitudService solicitudService;

    public SolicitudController (SolicitudService solicitudService){this.solicitudService = solicitudService;}
    
    //Crear solicitud "Usuario_adoptante"
    @PostMapping("/solicitud-mascota/{idMascota}")
    public ResponseEntity<?> crearSolicitud(@PathVariable Long idMascota, @RequestBody java.util.Map<String, Object> datosSolicitud){
        try {
            // Obtener ID de usuario del body o usar un valor por defecto si no viene
            Long usuarioAutenticadoId = null;
            if (datosSolicitud.containsKey("idUsuario")) {
                usuarioAutenticadoId = Long.valueOf(datosSolicitud.get("idUsuario").toString());
            } else {
                return ResponseEntity.badRequest().body("ID de usuario requerido");
            }

            // Crear objeto SolicitudAdopcion
            SolicitudAdopcion solicitudAdopcion = new SolicitudAdopcion();
            if (datosSolicitud.containsKey("mensajeAdoptante")) {
                solicitudAdopcion.setMensajeAdoptante(datosSolicitud.get("mensajeAdoptante").toString());
            }

            SolicitudAdopcion solicitudCreada = solicitudService.crearSolicitudAdopcion(idMascota, usuarioAutenticadoId, solicitudAdopcion);
            return new ResponseEntity<>(solicitudCreada, HttpStatus.CREATED);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear la solicitud: " + e.getMessage());
        }
    }

    //Aceptar Solicitud "Usuario_Resuelve"
    @PutMapping("/decision-mascota/{idSolicitud}")
    public ResponseEntity<?> decisionSolicitud(@PathVariable Long idSolicitud, @RequestBody java.util.Map<String, Object> datosSolicitud){
        try {
            // Obtener ID de usuario del body
            Long usuarioAutenticadoId = null;
            if (datosSolicitud.containsKey("idUsuario")) {
                usuarioAutenticadoId = Long.valueOf(datosSolicitud.get("idUsuario").toString());
            } else {
                return ResponseEntity.badRequest().body("ID de usuario requerido");
            }

            // Crear objeto SolicitudAdopcion con los datos
            SolicitudAdopcion solicitudAdopcion = new SolicitudAdopcion();
            if (datosSolicitud.containsKey("estadoSolicitud")) {
                String estadoStr = datosSolicitud.get("estadoSolicitud").toString().toUpperCase();
                try {
                    solicitudAdopcion.setEstadoSolicitud(SolicitudAdopcion.EstadoSolicitud.valueOf(estadoStr));
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Estado de solicitud inválido: " + estadoStr);
                }
            }

            java.util.Optional<SolicitudAdopcion> solicitudOpt = solicitudService.aceptarSolicitud(idSolicitud, usuarioAutenticadoId, solicitudAdopcion);
            
            if (solicitudOpt.isPresent()) {
                return ResponseEntity.ok(solicitudOpt.get());
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al procesar la decisión: " + e.getMessage());
        }
    }

    //Mostrar Solicitudes
    @GetMapping("/solicitudes")
    public ResponseEntity<List<SolicitudAdopcion>> mostrarSolicitudes(){
        
        List<SolicitudAdopcion> solicitud_adopcion = solicitudService.mostrarSolicitudes();
        return ResponseEntity.ok(solicitud_adopcion);
    }

    //Mostrar Solicitud
    @GetMapping("/solicitud/{id}")
    public ResponseEntity<SolicitudAdopcion> mostrarSolicitud(@PathVariable Long id){
        
        Optional<SolicitudAdopcion> solicitudAdopcion = solicitudService.mostrarSolicitud(id);

        if(solicitudAdopcion.isPresent()){
            return ResponseEntity.ok(solicitudAdopcion.get());
        }else
            return ResponseEntity.notFound().build();
        
    }
    

}
