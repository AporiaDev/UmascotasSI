package com.example.umascota.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.umascota.model.Usuario;
import com.example.umascota.service.UsuarioService;


@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioService usuarioService;


    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario user) {
        try {
            Usuario nuevoUsuario = usuarioService.registrarUsuario(user);
            return ResponseEntity.ok("Usuario registrado exitosamente: " + nuevoUsuario.getCorreoElectronico());
        } catch (IllegalArgumentException e) {
            // mensaje  desde el service
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        } catch (Exception e) {
            // cualquier otro error inesperado
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("Error al registrar usuario: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario user) {

        try {
            Usuario usuarioEncontrado = usuarioService.validarLoginYRetornarUsuario(user.getCorreoElectronico(), user.getContrasena());
            if (usuarioEncontrado != null) {
                // Crear objeto de respuesta con información del usuario
                LoginResponse response = new LoginResponse();
                response.setMensaje("Login exitoso. Bienvenido, " + usuarioEncontrado.getNombreCompleto());
                response.setTipoUsuario(usuarioEncontrado.getTipoUsuario().toString());
                response.setIdUsuario(usuarioEncontrado.getIdUsuario());
                response.setNombreCompleto(usuarioEncontrado.getNombreCompleto());
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Usuario o contraseña incorrectos");
            }
        } catch (Exception e) {
            e.printStackTrace(); // log en consola
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error interno en el login: " + e.getMessage());
        }

    }

    // Clase interna para la respuesta del login
    public static class LoginResponse {
        private String mensaje;
        private String tipoUsuario;
        private Long idUsuario;
        private String nombreCompleto;

        // Getters y Setters
        public String getMensaje() { return mensaje; }
        public void setMensaje(String mensaje) { this.mensaje = mensaje; }
        public String getTipoUsuario() { return tipoUsuario; }
        public void setTipoUsuario(String tipoUsuario) { this.tipoUsuario = tipoUsuario; }
        public Long getIdUsuario() { return idUsuario; }
        public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }
        public String getNombreCompleto() { return nombreCompleto; }
        public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }
    }
}
