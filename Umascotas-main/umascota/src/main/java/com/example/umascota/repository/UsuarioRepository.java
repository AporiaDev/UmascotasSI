package com.example.umascota.repository;


import java.util.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.umascota.model.usuario.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Usuario findByCorreoElectronico(String correoElectronico);
    Optional<Usuario> findByIdUsuario(Long IdUsuario);
}
