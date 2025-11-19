package com.example.umascota.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.umascota.model.usuario.Usuario;
import com.example.umascota.service.UsuarioService;
import com.example.umascota.util.JwtUtil;
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
            String token = usuarioService.login(usuario.getCorreoElectronico(), usuario.getContrasena());
            Usuario usuarioDB = usuarioService.obtenerUsuarioPorCorreo(usuario.getCorreoElectronico());
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("token", token);
            respuesta.put("mensaje", "Inicio de sesión exitoso");
            respuesta.put("rol", usuarioDB.getTipoUsuario().name());
            respuesta.put("idUsuario", usuarioDB.getIdUsuario());
            return ResponseEntity.ok(respuesta);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(401).body(error);
        }
    }

    @GetMapping("/verificar")
    public ResponseEntity<?> verificar(@RequestParam String token) {
        boolean valido = usuarioService.validarToken(token);
        return ResponseEntity.ok("¿Token válido?: " + valido);
    }

    @PostMapping("/google")
    public ResponseEntity<?> loginConGoogle(@RequestBody Map<String, String> request) {
        try {
            String idToken = request.get("idToken");
            if (idToken == null || idToken.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Token de Google requerido");
                return ResponseEntity.badRequest().body(error);
            }

            Usuario usuario = usuarioService.autenticarConGoogle(idToken);
            String token = JwtUtil.generateToken(usuario.getCorreoElectronico());
            
            Map<String, Object> respuesta = new HashMap<>();
            respuesta.put("token", token);
            respuesta.put("mensaje", "Autenticación con Google exitosa");
            respuesta.put("rol", usuario.getTipoUsuario().name());
            respuesta.put("idUsuario", usuario.getIdUsuario());
            
            return ResponseEntity.ok(respuesta);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(401).body(error);
        }
    }
}
