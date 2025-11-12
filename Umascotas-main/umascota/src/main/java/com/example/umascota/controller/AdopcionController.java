package com.example.umascota.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.umascota.model.adopcion.Adopcion;
import com.example.umascota.service.AdopcionService;

@RestController
@RequestMapping("/api/adopciones")
public class AdopcionController {

    private final AdopcionService adopcionService;

    public AdopcionController(AdopcionService adopcionService){
        this.adopcionService = adopcionService;
    }

    // GET - Obtener todas las adopciones
    @GetMapping
    public ResponseEntity<List<Adopcion>> obtenerAdopciones(){
        List<Adopcion> adopciones = adopcionService.mostrarAdopciones();
        return ResponseEntity.ok(adopciones);
    }

    // GET - Obtener adopción por ID
    @GetMapping("/{id}")
    public ResponseEntity<Adopcion> obtenerAdopcion(@PathVariable Long id){
        Optional<Adopcion> adopcion = adopcionService.mostrarAdopcion(id);
        if(adopcion.isPresent()){
            return ResponseEntity.ok(adopcion.get());
        }else{
            return ResponseEntity.notFound().build();
        }         
    }

    // PUT - Actualizar datos de adopción
    @PutMapping("/{id}")
    public ResponseEntity<Adopcion> actualizarAdopcion(@PathVariable Long id, @RequestBody Adopcion nuevosDatosAdopcion){
        Optional<Adopcion> adopcion = adopcionService.actualizarAdopcion(id, nuevosDatosAdopcion);
        if(adopcion.isPresent()){
            return ResponseEntity.ok(adopcion.get());
        }else{
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE - Eliminar adopción por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> borrarAdopcion(@PathVariable Long id){
        adopcionService.borrarAdopcion(id);
        return ResponseEntity.noContent().build();
    }
}
