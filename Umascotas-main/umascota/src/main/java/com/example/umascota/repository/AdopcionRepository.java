package com.example.umascota.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.umascota.model.adopcion.Adopcion;
import java.util.Optional;

@Repository
public interface AdopcionRepository extends JpaRepository<Adopcion, Long>{

    Optional<Adopcion> findByIdAdopcion(Long idAdopcion);
    boolean existsByIdAdopcion(Long idAdopcion);

}
