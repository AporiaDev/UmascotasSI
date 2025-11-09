package com.example.umascota.controller;


import java.util.List;
import java.util.Optional;

import org.apache.catalina.connector.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.RequestEntity;
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

    //GET
    @GetMapping("/obtener-mascota/{id}")
    public ResponseEntity<Mascota> obtenerMascota(@PathVariable Long id){

        Optional <Mascota> mascota = mascotaService.obtenerPorId(id);
        
        if(mascota.isPresent()){
            return ResponseEntity.ok(mascota.get());
        }else { 
            return ResponseEntity.notFound().build();
        }
        
    }

    @PostMapping("/crear-mascota")
    public ResponseEntity<Mascota> crearMascota(@RequestBody Mascota mascota){
        
        Mascota nuevaMascota = mascotaService.crearMascota(mascota);
        return new ResponseEntity<>(nuevaMascota, HttpStatus.CREATED);


    }

    //DELETE
    @DeleteMapping("/borrar-mascota/{idMascota}")
    public ResponseEntity<Void> borrarMascota(@PathVariable Long idMascota){

        mascotaService.borrarMascota(idMascota);
        return ResponseEntity.noContent().build();  

    }

    @GetMapping("/obtener-mascotas")
    public ResponseEntity<List<Mascota>> obtenerMascotas(){

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
