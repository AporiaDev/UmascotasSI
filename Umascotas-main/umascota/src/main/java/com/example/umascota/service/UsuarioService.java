package com.example.umascota.service;

import org.springframework.beans.factory.annotation.Autowired;
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
        String passwordEncriptada = PasswordUtil.encriptar(user.getContrasena());
        user.setContrasena(passwordEncriptada);
        return usuarioRepository.save(user);
    }

    // Validar login
    public boolean validarLogin(String correoElectronico, String password) {
        Usuario usuarioDB = usuarioRepository.findByCorreoElectronico(correoElectronico);
        return usuarioDB != null && PasswordUtil.verificar(password, usuarioDB.getContrasena());
    }
}
