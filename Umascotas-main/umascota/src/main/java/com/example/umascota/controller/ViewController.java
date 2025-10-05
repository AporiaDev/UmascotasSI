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

    @GetMapping("/mascotas")
    public String mascotas() {
        return "view/mascotas"; // busca mascotas.html en /templates
    }
}
