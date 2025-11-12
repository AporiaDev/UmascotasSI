package com.example.umascota.controller;


import java.util.List;
import java.util.Optional;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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


@RestController
@RequestMapping("/api/mascotas")
public class MascotaController {

    
    private final Mascota2Service mascotaService;

    public MascotaController(Mascota2Service mascotaService){this.mascotaService = mascotaService;}

    // GET - Obtener todas las mascotas
    @GetMapping
    public ResponseEntity<List<Mascota>> obtenerMascotas(){
        List<Mascota> mascotas = mascotaService.obtenerTodas();
        return ResponseEntity.ok(mascotas);
    }

    // GET - Obtener mascota por ID
    @GetMapping("/{id}")
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
