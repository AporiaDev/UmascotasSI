package com.example.umascota.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.umascota.model.Usuario;
import com.example.umascota.service.UsuarioService;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioService usuarioService;

    public AuthController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        try {
            // Modificar esta línea para que el servicio devuelva el usuario completo
            Usuario usuarioAutenticado = usuarioService.login(usuario.getCorreoElectronico(), usuario.getContrasena());
            
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("token", usuarioAutenticado.getToken()); // O como manejes el token
            respuesta.put("mensaje", "Inicio de sesión exitoso");
            respuesta.put("rol", usuarioAutenticado.getRol()); // ← Esto es lo importante
            respuesta.put("redirectUrl", getRedirectUrlByRole(usuarioAutenticado.getRol()));
            
            return ResponseEntity.ok(respuesta);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @GetMapping("/verificar")
    public ResponseEntity<?> verificar(@RequestParam String token) {
        boolean valido = usuarioService.validarToken(token);
        return ResponseEntity.ok("¿Token válido?: " + valido);
    }

    // Método auxiliar para determinar a dónde redirigir según el rol
    private String getRedirectUrlByRole(String rol) {
        if ("ADMIN".equals(rol)) {
            return "/dashboard-admin";
        } else {
            return "/dashboard-adoptante";
        }
    }
}
