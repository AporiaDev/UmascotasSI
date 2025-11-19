package com.example.umascota.repository;

import com.example.umascota.model.adopcion.EncuestaPostAdopcion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EncuestaRepository extends JpaRepository<EncuestaPostAdopcion, Long> {
    List<EncuestaPostAdopcion> findByAdopcionIdAdopcion(Long idAdopcion);
    List<EncuestaPostAdopcion> findByEstado(String estado);
    Optional<EncuestaPostAdopcion> findByIdEncuesta(Long idEncuesta);
    List<EncuestaPostAdopcion> findByAdopcionAdoptanteIdUsuario(Long idUsuario);
    List<EncuestaPostAdopcion> findByAdopcionAdoptanteIdUsuarioAndEstado(Long idUsuario, String estado);
}

