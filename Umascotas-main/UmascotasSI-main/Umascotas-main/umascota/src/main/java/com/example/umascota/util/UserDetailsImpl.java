package com.example.umascota.util;



import com.example.umascota.model.usuario.Usuario; // Usando tu paquete
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections; // Necesario para singletonList

// Implementa la interfaz de Spring Security
public class UserDetailsImpl implements UserDetails {

    private final Usuario usuario; 

    // Constructor que toma tu entidad
    public UserDetailsImpl(Usuario usuario) {
        this.usuario = usuario;
    }

    // Método que usarás en el Controller (@AuthenticationPrincipal)
    public Long getId() {
        return usuario.getIdUsuario(); // Usando tu getter: getIdUsuario()
    }

    // =================================================================
    // MÉTODOS REQUERIDOS POR LA INTERFAZ UserDetails
    // =================================================================
    
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // CORRECCIÓN: Maneja el único rol (Enum) y lo envuelve en una colección
        String rolNombre = usuario.getTipoUsuario().name(); // Obtiene "ADMIN" o "USUARIO"
        SimpleGrantedAuthority authority = new SimpleGrantedAuthority(rolNombre);
        
        return Collections.singletonList(authority); 
    }

    @Override
    public String getPassword() {
        return usuario.getContrasena(); // Usando tu getter: getContrasena()
    }

    @Override
    public String getUsername() {
        return usuario.getCorreoElectronico(); // Usando tu getter: getCorreoElectronico()
    }

    // --- Métodos de Estado de la Cuenta (Dejamos como true por simplicidad) ---

    @Override
    public boolean isAccountNonExpired() {
        return true; 
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; 
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; 
    }

    @Override
    public boolean isEnabled() {
        // Podrías usar tu campo emailVerified si lo consideras la condición de habilitación
        return usuario.getEmailVerified(); 
    }
}