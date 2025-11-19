package com.example.umascota.controller;


import java.util.List;
import java.util.Optional;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.example.umascota.model.mascota.Mascota;
import com.example.umascota.service.Mascota2Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {

    private static final Logger logger = LoggerFactory.getLogger(MascotaController.class);
    
    private final Mascota2Service mascotaService;

    public MascotaController(Mascota2Service mascotaService){this.mascotaService = mascotaService;}

    // GET - Obtener todas las mascotas
    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<?> obtenerMascotas(){
        try {
            logger.info("Solicitud para obtener todas las mascotas");
            List<Mascota> mascotas = mascotaService.obtenerTodas();
            logger.info("Se encontraron {} mascotas", mascotas.size());
            
            // Asegurar que todas las relaciones estén inicializadas antes de serializar
            for (Mascota mascota : mascotas) {
                try {
                    // Forzar la inicialización de todas las relaciones necesarias
                    if (mascota.getUsuarioPublica() != null) {
                        mascota.getUsuarioPublica().getIdUsuario();
                        mascota.getUsuarioPublica().getNombreCompleto();
                        mascota.getUsuarioPublica().getCorreoElectronico();
                    }
                    // Inicializar otros campos que puedan causar problemas
                    mascota.getIdMascota();
                    mascota.getNombre();
                    mascota.getEspecie();
                } catch (Exception e) {
                    logger.warn("Error al inicializar relaciones para mascota {}: {}", 
                        mascota.getIdMascota(), e.getMessage());
                }
            }
            
            return ResponseEntity.ok(mascotas);
        } catch (org.hibernate.LazyInitializationException e) {
            logger.error("Error de LazyInitialization al obtener las mascotas: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al cargar las mascotas: Problema de inicialización de datos");
        } catch (Exception e) {
            logger.error("Error al obtener las mascotas: ", e);
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al cargar las mascotas: " + e.getMessage());
        }
    }

    // GET - Obtener mascota por ID
    @GetMapping("/{id}")
    @Transactional(readOnly = true)
    public ResponseEntity<Mascota> obtenerMascotaPorId(@PathVariable Long id){
        Optional<Mascota> mascota = mascotaService.obtenerPorId(id);
        if(mascota.isPresent()){
            return ResponseEntity.ok(mascota.get());
        }else { 
            return ResponseEntity.notFound().build();
        }
    }

    // POST - Crear nueva mascota
    @PostMapping
    public ResponseEntity<Mascota> crearMascota(@RequestBody Mascota mascota){
        Mascota nuevaMascota = mascotaService.crearMascota(mascota);
        return new ResponseEntity<>(nuevaMascota, HttpStatus.CREATED);
    }

    // PUT - Actualizar mascota por ID
    @PutMapping("/{id}")
    public ResponseEntity<Mascota> actualizarMascota(@PathVariable Long id, @RequestBody Mascota nuevosDatosMascota){
        Optional<Mascota> mascotaNueva = mascotaService.actualizarDatosMascota(id, nuevosDatosMascota);
        if (mascotaNueva.isPresent()) {
            return ResponseEntity.ok(mascotaNueva.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Eliminar mascota por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrarMascota(@PathVariable Long id){
        mascotaService.borrarMascota(id);
        return ResponseEntity.noContent().build();
    }
}
