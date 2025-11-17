package com.example.umascota.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller

public class ViewController {

    // Página principal para elegir login o registro
    @GetMapping("/")
    public String home(Model model) {
        model.addAttribute("mensaje", "Bienvenido a U-Mascota");
        return "view/home"; // templates/home.html
    }

    // Vista de login
    @GetMapping("/login")
    public String login() {
        return "view/login"; // templates/login.html
    }

    // Vista de registro
    @GetMapping("/registro")
    public String register() {
        return "view/register"; // templates/register.html
    }
        // Vista para crear mascotas
    @GetMapping("/crear-mascota")
    public String crearMascota() {
        return "view/crear-mascota";
    }

    // Vista para listar todas las mascotas
    @GetMapping("/listar-mascotas")
    public String listarMascotas() {
        return "view/listar-mascotas";
    }
}
