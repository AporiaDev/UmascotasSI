package com.example.umascota.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class PasswordUtil {

    private static final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    // Encriptar contraseña
    public static String encriptar(String password) {
        return passwordEncoder.encode(password);
    }

    // Verificar contraseña
    public static boolean verificar(String rawPassword, String hashedPassword) {
        return passwordEncoder.matches(rawPassword, hashedPassword);
    }
}
