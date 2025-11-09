package com.example.umascota.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.umascota.model.adopcion.SolicitudAdopcion;


public interface  SolicitudAdopcionRepository extends JpaRepository<SolicitudAdopcion, Long>{

    List<SolicitudAdopcion> findByIdSolicitud(Long idSolicitud);

    
}
