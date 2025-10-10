package com.example.umascota.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import com.example.umascota.model.Usuario;
import com.example.umascota.repository.UsuarioRepository;
import com.example.umascota.util.PasswordUtil;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;
    // Registrar un nuevo usuario con contraseña encriptada
    public Usuario registrarUsuario(Usuario user) {

        String emailNormalizado = user.getCorreoElectronico().trim().toLowerCase();
        user.setCorreoElectronico(emailNormalizado);

        String passwordEncriptada = PasswordUtil.encriptar(user.getContrasena());
        user.setContrasena(passwordEncriptada);

        try {
            return usuarioRepository.save(user);// revisar
        } catch (DataIntegrityViolationException e) {
            throw new IllegalArgumentException("El correo ya está registrado");
        }
        
    }

    // Validar login
    public boolean validarLogin(String correoElectronico, String password) {
        Usuario usuarioDB = usuarioRepository.findByCorreoElectronico(correoElectronico);
        return usuarioDB != null && PasswordUtil.verificar(password, usuarioDB.getContrasena());
    }

}
