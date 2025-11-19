package com.example.umascota.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.Optional;
import com.example.umascota.model.usuario.Usuario;
import com.example.umascota.repository.UsuarioRepository;
import com.example.umascota.util.PasswordUtil;
import com.example.umascota.util.JwtUtil;
import com.example.umascota.util.GoogleTokenVerifier;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private GoogleTokenVerifier googleTokenVerifier;

    // Registrar nuevo usuario
    public Usuario registrarUsuario(Usuario user) {

        String emailNormalizado = user.getCorreoElectronico().trim().toLowerCase();
        user.setCorreoElectronico(emailNormalizado);

        // Solo encriptar contraseña si se proporciona (no para usuarios de Google)
        if (user.getContrasena() != null && !user.getContrasena().isEmpty()) {
            String passwordEncriptada = PasswordUtil.encriptar(user.getContrasena());
            user.setContrasena(passwordEncriptada);
        }

        // Establecer rol por defecto a USUARIO si no viene
        if (user.getTipoUsuario() == null) {
            user.setTipoUsuario(Usuario.Rol.USUARIO);
        }

        // Establecer valores por defecto
        user.setEmailVerified(false);
        user.setNotificationsEnabled(true);

        try {
            return usuarioRepository.save(user);
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }
    }

    // Login — genera un token JWT si las credenciales son correctas
    public String login(String correoElectronico, String password) {
        Usuario usuarioDB = usuarioRepository.findByCorreoElectronico(correoElectronico.trim().toLowerCase());

        if (usuarioDB == null) {
            throw new IllegalArgumentException("Correo o contraseña incorrectos");
        }
        
        // Verificar si el usuario tiene contraseña (no es usuario de Google)
        if (usuarioDB.getContrasena() == null || usuarioDB.getContrasena().isEmpty()) {
            throw new IllegalArgumentException("Este usuario se autentica con Google. Por favor, usa el botón de Google para iniciar sesión.");
        }
        
        if (!PasswordUtil.verificar(password, usuarioDB.getContrasena())) {
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
    
    // Obtener usuario por correo electrónico
    public Usuario obtenerUsuarioPorCorreo(String correoElectronico) {
        return usuarioRepository.findByCorreoElectronico(correoElectronico.trim().toLowerCase());
    }
    
    // Obtener usuario por ID
    public Optional<Usuario> obtenerUsuarioPorId(Long id) {
        return usuarioRepository.findByIdUsuario(id);
    }
    
    // Actualizar datos del usuario (sin permitir cambiar correo)
    public Usuario actualizarUsuario(Long id, Usuario datosActualizados) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByIdUsuario(id);
        
        if (usuarioOpt.isEmpty()) {
            throw new IllegalArgumentException("Usuario no encontrado");
        }
        
        Usuario usuarioExistente = usuarioOpt.get();
        
        // Actualizar solo los campos permitidos (NO el correo)
        if (datosActualizados.getNombreCompleto() != null) {
            usuarioExistente.setNombreCompleto(datosActualizados.getNombreCompleto());
        }
        if (datosActualizados.getTelefono() != null) {
            usuarioExistente.setTelefono(datosActualizados.getTelefono());
        }
        if (datosActualizados.getCiudad() != null) {
            usuarioExistente.setCiudad(datosActualizados.getCiudad());
        }
        if (datosActualizados.getDireccion() != null) {
            usuarioExistente.setDireccion(datosActualizados.getDireccion());
        }
        if (datosActualizados.getDocumento() != null) {
            usuarioExistente.setDocumento(datosActualizados.getDocumento());
        }
        // Actualizar notificaciones (siempre se puede actualizar)
        usuarioExistente.setNotificationsEnabled(datosActualizados.getNotificationsEnabled());
        
        // Si se proporciona una nueva contraseña, encriptarla
        if (datosActualizados.getContrasena() != null && !datosActualizados.getContrasena().isEmpty()) {
            String passwordEncriptada = PasswordUtil.encriptar(datosActualizados.getContrasena());
            usuarioExistente.setContrasena(passwordEncriptada);
        }
        
        return usuarioRepository.save(usuarioExistente);
    }
    
    // Autenticación/Registro con Google
    public Usuario autenticarConGoogle(String idTokenString) {
        try {
            // Verificar el token de Google
            GoogleIdToken.Payload payload = googleTokenVerifier.verifyToken(idTokenString);
            
            String email = payload.getEmail();
            String googleId = payload.getSubject();
            String nombre = (String) payload.get("name");
            boolean emailVerified = payload.getEmailVerified();
            
            if (email == null || email.isEmpty()) {
                throw new IllegalArgumentException("El token de Google no contiene un email válido");
            }
            
            String emailNormalizado = email.trim().toLowerCase();
            
            // Buscar si el usuario ya existe por email o por googleId
            Usuario usuarioExistente = usuarioRepository.findByCorreoElectronico(emailNormalizado);
            
            if (usuarioExistente != null) {
                // Usuario existe - actualizar googleId si no lo tiene
                if (usuarioExistente.getGoogleId() == null || usuarioExistente.getGoogleId().isEmpty()) {
                    usuarioExistente.setGoogleId(googleId);
                    usuarioExistente.setEmailVerified(emailVerified);
                    usuarioRepository.save(usuarioExistente);
                }
                return usuarioExistente;
            } else {
                // Usuario no existe - crear nuevo usuario
                Usuario nuevoUsuario = new Usuario();
                nuevoUsuario.setCorreoElectronico(emailNormalizado);
                nuevoUsuario.setNombreCompleto(nombre != null ? nombre : emailNormalizado);
                nuevoUsuario.setGoogleId(googleId);
                nuevoUsuario.setEmailVerified(emailVerified);
                nuevoUsuario.setTipoUsuario(Usuario.Rol.USUARIO);
                nuevoUsuario.setNotificationsEnabled(true);
                // No establecemos contraseña para usuarios de Google (null es permitido)
                nuevoUsuario.setContrasena(null);
                
                return usuarioRepository.save(nuevoUsuario);
            }
        } catch (Exception e) {
            throw new IllegalArgumentException("Error en autenticación con Google: " + e.getMessage());
        }
    }
}
