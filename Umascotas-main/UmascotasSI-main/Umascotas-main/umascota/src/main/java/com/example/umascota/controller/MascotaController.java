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

    //GET - Endpoint REST estándar
    @GetMapping
    public ResponseEntity<List<Mascota>> obtenerMascotas(){
        List<Mascota> mascotas = mascotaService.obtenerTodas();
        return ResponseEntity.ok(mascotas);
    }

    //GET - Endpoint REST estándar por ID
    @GetMapping("/{id}")
    public ResponseEntity<Mascota> obtenerMascotaPorId(@PathVariable Long id){
        Optional<Mascota> mascota = mascotaService.obtenerPorId(id);
        if(mascota.isPresent()){
            return ResponseEntity.ok(mascota.get());
        }else { 
            return ResponseEntity.notFound().build();
        }
    }

    //POST - Endpoint REST estándar
    @PostMapping
    public ResponseEntity<Mascota> crearMascota(@RequestBody Mascota mascota){
        Mascota nuevaMascota = mascotaService.crearMascota(mascota);
        return new ResponseEntity<>(nuevaMascota, HttpStatus.CREATED);
    }

    //GET - Endpoint legacy
    @GetMapping("/obtener-mascota/{id}")
    public ResponseEntity<Mascota> obtenerMascota(@PathVariable Long id){
        Optional <Mascota> mascota = mascotaService.obtenerPorId(id);
        if(mascota.isPresent()){
            return ResponseEntity.ok(mascota.get());
        }else { 
            return ResponseEntity.notFound().build();
        }
    }

  

    //DELETE - Endpoint REST estándar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrarMascotaPorId(@PathVariable Long id){
        mascotaService.borrarMascota(id);
        return ResponseEntity.noContent().build();
    }

    //DELETE - Endpoint legacy
    @DeleteMapping("/borrar-mascota/{idMascota}")
    public ResponseEntity<Void> borrarMascota(@PathVariable Long idMascota){
        mascotaService.borrarMascota(idMascota);
        return ResponseEntity.noContent().build();  
    }

    //GET - Endpoint legacy
    @GetMapping("/obtener-mascotas")
    public ResponseEntity<List<Mascota>> obtenerMascotasLegacy(){
        List<Mascota> mascotas = mascotaService.obtenerTodas();
        return ResponseEntity.ok(mascotas);
    }


    //PUT
    @PutMapping("/actualizar-mascota/{idMascota}")
    public ResponseEntity<Mascota> actualizarMascota(@PathVariable Long idMascota, @RequestBody Mascota nuevosDatosMascota){

        Optional<Mascota> mascotaNueva = mascotaService.actualizarDatosMascota(idMascota, nuevosDatosMascota);
        if (mascotaNueva.isPresent()) {
            return ResponseEntity.ok(mascotaNueva.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
