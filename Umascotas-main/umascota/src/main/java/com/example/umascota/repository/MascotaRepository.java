package com.example.umascota.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.umascota.model.mascota.Mascota;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Long> {
    
    @EntityGraph(attributePaths = {"usuarioPublica"})
    Optional<Mascota> findByIdMascota(Long idMascota);
    
    @EntityGraph(attributePaths = {"usuarioPublica"})
    @Override
    List<Mascota> findAll();
    
    boolean existsByNombreIgnoreCase(String nombre);
    List<Mascota> deleteByIdMascota(Long id);
    boolean existsByIdMascota(Long idMascota);
    
}

