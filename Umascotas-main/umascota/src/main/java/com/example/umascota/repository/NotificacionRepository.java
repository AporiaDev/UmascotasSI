package com.example.umascota.repository;

import com.example.umascota.model.usuario.Notificacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificacionRepository extends JpaRepository<Notificacion, Long> {
    List<Notificacion> findByUsuarioIdUsuarioOrderByFechaCreacionDesc(Long idUsuario);
    List<Notificacion> findByUsuarioIdUsuarioAndLeidaFalseOrderByFechaCreacionDesc(Long idUsuario);
    Long countByUsuarioIdUsuarioAndLeidaFalse(Long idUsuario);
}

