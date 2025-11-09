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

    // Vista para listar todas las solicitudes
    @GetMapping("/listar-solicitudes")
    public String listarSolicitudes() {
        return "view/listar-solicitudes";
    }

    // Vista para ver una solicitud específica
    @GetMapping("/ver-solicitud/{id}")
    public String verSolicitud() {
        return "view/ver-solicitud";
    }

    // Vista para crear una solicitud de adopción
    @GetMapping("/crear-solicitud/{idMascota}")
    public String crearSolicitud() {
        return "view/crear-solicitud";
    }

    // Vista para tomar decisión sobre una solicitud
    @GetMapping("/decision-solicitud/{idSolicitud}")
    public String decisionSolicitud() {
        return "view/decision-solicitud";
    }

    // Dashboard para usuarios
    @GetMapping("/dashboard-usuario")
    public String dashboardUsuario() {
        return "view/dashboard-usuario";
    }

    // Dashboard para administradores
    @GetMapping("/dashboard-admin")
    public String dashboardAdmin() {
        return "view/dashboard-admin";
    }

    // Vista para ver detalles de una mascota
    @GetMapping("/ver-mascota/{id}")
    public String verMascota() {
        return "view/ver-mascota";
    }
}
