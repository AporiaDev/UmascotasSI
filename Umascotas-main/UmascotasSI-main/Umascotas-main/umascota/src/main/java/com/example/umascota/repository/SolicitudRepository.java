package com.example.umascota.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.umascota.model.adopcion.SolicitudAdopcion;
import java.util.Optional;



public interface SolicitudRepository extends JpaRepository<SolicitudAdopcion, Long> {

    Optional<SolicitudAdopcion> findByIdSolicitud(Long idSolicitud);
}
