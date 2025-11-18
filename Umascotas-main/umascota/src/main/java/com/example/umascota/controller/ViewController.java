package com.example.umascota.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller

public class ViewController {

    // Página principal - React App
    @GetMapping("/")
    public String home(Model model) {
        return "view/react-app"; // React SPA
    }

    // Vista de login - React App
    @GetMapping("/login")
    public String login() {
        return "view/react-app"; // React SPA
    }

    // Vista de registro - React App
    @GetMapping("/registro")
    public String register() {
        return "view/react-app"; // React SPA
    }
    // Vista para crear mascotas - React App
    @GetMapping("/crear-mascota")
    public String crearMascota() {
        return "view/react-app";
    }

    // Vista para listar todas las mascotas - React App
    @GetMapping("/listar-mascotas")
    public String listarMascotas() {
        return "view/react-app";
    }

    // Vista para listar todas las solicitudes - React App
    @GetMapping("/listar-solicitudes")
    public String listarSolicitudes() {
        return "view/react-app";
    }

    // Vista para ver una solicitud específica - React App
    @GetMapping("/ver-solicitud/{id}")
    public String verSolicitud() {
        return "view/react-app";
    }

    // Vista para crear una solicitud de adopción - React App
    @GetMapping("/crear-solicitud/{idMascota}")
    public String crearSolicitud() {
        return "view/react-app";
    }

    // Vista para tomar decisión sobre una solicitud - React App
    @GetMapping("/decision-solicitud/{idSolicitud}")
    public String decisionSolicitud() {
        return "view/react-app";
    }

    // Dashboard para usuarios - React App
    @GetMapping("/dashboard-usuario")
    public String dashboardUsuario() {
        return "view/react-app";
    }

    // Dashboard para administradores - React App
    @GetMapping("/dashboard-admin")
    public String dashboardAdmin() {
        return "view/react-app";
    }

    // Vista para ver detalles de una mascota - React App
    @GetMapping("/mascota/{id}")
    public String verMascota() {
        return "view/react-app";
    }

    // Vista para editar una mascota - React App
    @GetMapping("/editar-mascota/{id}")
    public String editarMascota() {
        return "view/react-app";
    }

    // Vista para listar todas las adopciones - React App
    @GetMapping("/adopciones")
    public String listarAdopciones() {
        return "view/react-app";
    }

    // Vista para ver detalles de una adopción específica - React App
    @GetMapping("/adopcion/{id}")
    public String verAdopcion() {
        return "view/react-app";
    }

    // Vista de perfil de usuario - React App
    @GetMapping("/perfil")
    public String perfilUsuario() {
        return "view/react-app";
    }
}
