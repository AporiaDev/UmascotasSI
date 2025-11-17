package com.example.umascota.controller;

import com.example.umascota.model.Mascota;
import com.example.umascota.repository.MascotaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

@Controller
public class VistaAdoptanteController {

    @Autowired
    private MascotaRepository mascotaRepository;

    // Mostrar todas las mascotas disponibles
    @GetMapping("/adoptante/mascotas")
    public String listarMascotasDisponibles(Model model) {
        List<Mascota> disponibles = mascotaRepository.findByEstadoPublicacion(Mascota.EstadoPublicacion.disponible);
        model.addAttribute("mascotas", disponibles);
        return "mascotas-adoptante";
    }

    // Buscar mascota por nombre
    @GetMapping("/adoptante/mascotas/buscar")
    public String buscarMascota(@RequestParam String nombre, Model model) {
        List<Mascota> resultados = mascotaRepository.findByNombreIgnoreCase(nombre);
        model.addAttribute("mascotas", resultados);
        return "mascotas-adoptante";
    }
}
