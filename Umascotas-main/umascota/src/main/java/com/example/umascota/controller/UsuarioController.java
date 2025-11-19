package com.example.umascota.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.umascota.model.usuario.Usuario;
import com.example.umascota.service.UsuarioService;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // GET - Obtener usuario por ID
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerUsuario(@PathVariable Long id) {
        Optional<Usuario> usuario = usuarioService.obtenerUsuarioPorId(id);
        if (usuario.isPresent()) {
            // No devolver la contraseña
            Usuario usuarioSinPassword = usuario.get();
            usuarioSinPassword.setContrasena(null);
            return ResponseEntity.ok(usuarioSinPassword);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT - Actualizar usuario (sin permitir cambiar correo)
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioActualizado) {
        try {
            // Verificar que el usuario existe
            Optional<Usuario> usuarioOpt = usuarioService.obtenerUsuarioPorId(id);
            if (usuarioOpt.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            
            // Asegurar que no se intente cambiar el correo
            if (usuarioActualizado.getCorreoElectronico() != null) {
                // Mantener el correo original
                usuarioActualizado.setCorreoElectronico(usuarioOpt.get().getCorreoElectronico());
            }
            
            Usuario usuarioActualizadoObj = usuarioService.actualizarUsuario(id, usuarioActualizado);
            // No devolver la contraseña
            usuarioActualizadoObj.setContrasena(null);
            return ResponseEntity.ok(usuarioActualizadoObj);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al actualizar el usuario: " + e.getMessage());
        }
    }
}

