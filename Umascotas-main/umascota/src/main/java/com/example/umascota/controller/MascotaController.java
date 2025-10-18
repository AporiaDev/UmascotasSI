package com.example.umascota.controller;

import com.example.umascota.model.Mascota;
import com.example.umascota.repository.MascotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {

    @Autowired
    private MascotaRepository mascotaRepository;

    // Obtener todas las mascotas
    @GetMapping
    public List<Mascota> getAllMascotas() {
        return mascotaRepository.findAll();
    }

    // Obtener una mascota por Nombre
    @GetMapping("/{nombre}")
    public List<Mascota> getMascotaById(@PathVariable String nombre) {
        return mascotaRepository.findByNombreIgnoreCase(nombre);
    }

    // Crear una mascota
    @PostMapping
    public Mascota createMascota(@RequestBody Mascota mascota) {
        return mascotaRepository.save(mascota);
    }

    // Actualizar una mascota
    @PutMapping("/{id}")
    public ResponseEntity<Mascota> updateMascota(@PathVariable Long id, @RequestBody Mascota mascotaDetails) {
        return mascotaRepository.findById(id).map(mascota -> {
            mascota.setNombre(mascotaDetails.getNombre());
            mascota.setEspecie(mascotaDetails.getEspecie());
            mascota.setRaza(mascotaDetails.getRaza());
            mascota.setEdad(mascotaDetails.getEdad());
            mascota.setDescripcion(mascotaDetails.getDescripcion());
            mascota.setEstadoSalud(mascotaDetails.getEstadoSalud());
            mascota.setFoto(mascotaDetails.getFoto());
            mascota.setEstadoPublicacion(mascotaDetails.getEstadoPublicacion());
            mascota.setIdUsuarioPublica(mascotaDetails.getIdUsuarioPublica());
            return ResponseEntity.ok(mascotaRepository.save(mascota));
        }).orElse(ResponseEntity.notFound().build());
    }

    // Eliminar una mascota
    @DeleteMapping("/{id}")
    public ResponseEntity<Object> deleteMascota(@PathVariable Long id) {
        return mascotaRepository.findById(id).map(mascota -> {
            mascotaRepository.delete(mascota);
            return ResponseEntity.noContent().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    // Obtener mascotas disponibles para adopción
    @GetMapping("/disponibles")
    public List<Mascota> getMascotasDisponibles() {
        return mascotaRepository.findByEstadoPublicacion(Mascota.EstadoPublicacion.disponible);
    }

    // Adoptar una mascota
    @PostMapping("/{id}/adoptar")
    public ResponseEntity<?> adoptarMascota(@PathVariable Long id, @RequestBody AdopcionRequest request) {
        return mascotaRepository.findById(id).map(mascota -> {
            if (mascota.getEstadoPublicacion() == Mascota.EstadoPublicacion.disponible) {
                mascota.setEstadoPublicacion(Mascota.EstadoPublicacion.adoptado);
                mascotaRepository.save(mascota);
                return ResponseEntity.ok("Mascota adoptada exitosamente");
            } else {
                return ResponseEntity.badRequest().body("La mascota no está disponible para adopción");
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    // Clase para la solicitud de adopción
    public static class AdopcionRequest {
        private Long idAdoptante;
        private String mensaje;

        public Long getIdAdoptante() { return idAdoptante; }
        public void setIdAdoptante(Long idAdoptante) { this.idAdoptante = idAdoptante; }
        public String getMensaje() { return mensaje; }
        public void setMensaje(String mensaje) { this.mensaje = mensaje; }
    }
}
