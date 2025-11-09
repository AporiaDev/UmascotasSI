package com.example.umascota.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.example.umascota.model.usuario.Usuario;
import com.example.umascota.repository.UsuarioRepository;
import com.example.umascota.util.PasswordUtil;
import com.example.umascota.util.JwtUtil;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Registrar nuevo usuario
    public Usuario registrarUsuario(Usuario user) {

        String emailNormalizado = user.getCorreoElectronico().trim().toLowerCase();
        user.setCorreoElectronico(emailNormalizado);

        String passwordEncriptada = PasswordUtil.encriptar(user.getContrasena());
        user.setContrasena(passwordEncriptada);

        try {
            return usuarioRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }
    }

    // Login — genera un token JWT si las credenciales son correctas
    public String login(String correoElectronico, String password) {
        Usuario usuarioDB = usuarioRepository.findByCorreoElectronico(correoElectronico.trim().toLowerCase());

        if (usuarioDB == null || !PasswordUtil.verificar(password, usuarioDB.getContrasena())) {
            throw new IllegalArgumentException("Correo o contraseña incorrectos");
        }
        // Generar token JWT
        return JwtUtil.generateToken(usuarioDB.getCorreoElectronico());
    }
    // Verificar si un token es válido
    public boolean validarToken(String token) {
        return JwtUtil.validateToken(token);
    }
    // Obtener el correo desde el token
    public String obtenerCorreoDesdeToken(String token) {
        return JwtUtil.getSubjectFromToken(token);
    }
}
