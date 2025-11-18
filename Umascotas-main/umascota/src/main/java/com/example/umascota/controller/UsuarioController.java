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
}

