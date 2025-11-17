package com.example.umascota.repository;

import com.example.umascota.model.Mascota;
import com.example.umascota.model.Mascota.EstadoPublicacion;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MascotaRepository extends JpaRepository<Mascota, Long> {
    List<Mascota> findByNombreIgnoreCase(String nombre);
    List<Mascota> findByEstadoPublicacion(EstadoPublicacion estadoPublicacion);
}

