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

    // ===========================================
    // NUEVAS VISTAS PARA MANEJAR ROLES
    // ===========================================

    // Vista del dashboard del adoptante (lo que debería ver después del login)
    @GetMapping("/dashboard-adoptante")
    public String dashboardAdoptante(Model model) {
        model.addAttribute("rol", "ADOPTANTE");
        model.addAttribute("mensaje", "Bienvenido Adoptante");
        return "view/home"; // Puedes cambiar esto por una vista específica
    }

    // Vista del dashboard del admin
    @GetMapping("/dashboard-admin")
    public String dashboardAdmin(Model model) {
        model.addAttribute("rol", "ADMIN");
        model.addAttribute("mensaje", "Bienvenido Administrador");
        return "view/home"; // Puedes cambiar esto por una vista específica
    }

    // Vista de redirección después del login (determina a dónde ir según el rol)
    @GetMapping("/after-login")
    public String afterLogin() {
        // Esta vista debería ser manejada con lógica de seguridad/roles
        // Por ahora redirige al home, pero necesitamos modificar el AuthController
        return "redirect:/";
    }
}
