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
    // NUEVAS VISTAS PARA MANEJAR TIPOS DE USUARIO
    // ===========================================

    // Vista del dashboard del adoptante (lo que debería ver después del login)
    @GetMapping("/dashboard-adoptante")
    public String dashboardAdoptante(Model model) {
        model.addAttribute("tipoUsuario", "ADOPTANTE");
        model.addAttribute("mensaje", "Bienvenido Adoptante");
        model.addAttribute("descripcion", "Aquí puedes encontrar mascotas para adoptar");
        return "view/home"; // Puedes cambiar esto por una vista específica
    }

    // Vista del dashboard del publicador
    @GetMapping("/dashboard-publicador")
    public String dashboardPublicador(Model model) {
        model.addAttribute("tipoUsuario", "PUBLICADOR");
        model.addAttribute("mensaje", "Bienvenido Publicador");
        model.addAttribute("descripcion", "Aquí puedes gestionar las mascotas que publicas");
        return "view/home"; // Puedes cambiar esto por una vista específica
    }

    // Vista de perfil de usuario
    @GetMapping("/perfil")
    public String perfilUsuario(Model model) {
        model.addAttribute("mensaje", "Mi Perfil");
        return "view/home"; // Cambiar por vista de perfil cuando exista
    }

    // Vista de mascotas favoritas (para adoptantes)
    @GetMapping("/mis-favoritas")
    public String misFavoritas(Model model) {
        model.addAttribute("mensaje", "Mis Mascotas Favoritas");
        return "view/home"; // Cambiar por vista de favoritos cuando exista
    }

    // Vista de mis publicaciones (para publicadores)
    @GetMapping("/mis-publicaciones")
    public String misPublicaciones(Model model) {
        model.addAttribute("mensaje", "Mis Publicaciones");
        return "view/home"; // Cambiar por vista de publicaciones cuando exista
    }
}
