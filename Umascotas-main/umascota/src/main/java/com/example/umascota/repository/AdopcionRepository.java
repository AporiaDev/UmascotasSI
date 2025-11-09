package com.example.umascota.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.example.umascota.model.adopcion.Adopcion;

@Repository
public interface AdopcionRepository extends JpaRepository<Adopcion, Long> {
    
}
