package com.example.umascota.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.umascota.model.adopcion.Adopcion;
import com.example.umascota.model.adopcion.SolicitudAdopcion;
import com.example.umascota.model.mascota.Mascota;
import com.example.umascota.model.usuario.Usuario;
import com.example.umascota.repository.AdopcionRepository;
import com.example.umascota.repository.MascotaRepository;
import com.example.umascota.repository.SolicitudRepository;
import com.example.umascota.repository.UsuarioRepository;


@Service
public class SolicitudService {

    @Autowired
    public MascotaRepository mascotaRepository;

    @Autowired
    public SolicitudRepository solicitudRepository;

    @Autowired
    public UsuarioRepository usuarioRepository;

    @Autowired
    public AdopcionRepository adopcionRepository;



    //Crear Solicitud, por defecto le llega al admin en PENDIENTE
    public SolicitudAdopcion crearSolicitudAdopcion(Long idMascota, Long id_usuario_adoptante, SolicitudAdopcion solicitudAdopcion){

        Optional<Usuario> usuario = usuarioRepository.findByIdUsuario(id_usuario_adoptante);
        Optional<Mascota> mascota = mascotaRepository.findByIdMascota(idMascota);


        if (usuario.isEmpty() || mascota.isEmpty()) {
            throw new RuntimeException("Usuario o Mascota no encontrados");
        }

        // Establecer relaciones
        solicitudAdopcion.setUsuarioAdoptante(usuario.get());
        solicitudAdopcion.setMascotaSolicitada(mascota.get());

        // Establecer estado por defecto si no viene
        if (solicitudAdopcion.getEstadoSolicitud() == null) {
            solicitudAdopcion.setEstadoSolicitud(SolicitudAdopcion.EstadoSolicitud.PENDIENTE);
        }

        // Establecer fecha de solicitud si no viene
        if (solicitudAdopcion.getFechaSolicitud() == null) {
            solicitudAdopcion.setFechaSolicitud(new java.sql.Timestamp(System.currentTimeMillis()));
        }

        // Asegurar que usuarioResolvio sea null al crear (se establecerá cuando se resuelva)
        solicitudAdopcion.setUsuarioResolvio(null);
        solicitudAdopcion.setFechaResolucion(null);

        return solicitudRepository.save(solicitudAdopcion);

    }

    //Listar Solicitudes
    public List<SolicitudAdopcion> mostrarSolicitudes(){
        return solicitudRepository.findAll();
    }

    //Aceptar Solicitud, Enviado desde LA PUERTA ADMIN
    // Archivo: SolicitudAdopcionService.java - Versión estándar
    public Optional<SolicitudAdopcion> aceptarSolicitud(Long idSolicitud, Long usuarioResolvio, SolicitudAdopcion datoRespuesta){
    
        Optional<Usuario> usuario = usuarioRepository.findByIdUsuario(usuarioResolvio);
        
        if (usuario.isEmpty()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        // Usamos el método ESTÁNDAR findById()
        return solicitudRepository.findById(idSolicitud)
            .map(solicitudAdopcion -> {
            
                solicitudAdopcion.setEstadoSolicitud(datoRespuesta.getEstadoSolicitud());
                solicitudAdopcion.setUsuarioResolvio(usuario.get());
                
                // Establecer fecha de resolución si no está establecida
                if (datoRespuesta.getFechaResolucion() != null) {
                    solicitudAdopcion.setFechaResolucion(datoRespuesta.getFechaResolucion());
                } else {
                    solicitudAdopcion.setFechaResolucion(new java.sql.Timestamp(System.currentTimeMillis()));
                }

                // Si la solicitud es ACEPTADA, actualizar el estado de la mascota a ADOPTADA
                if (datoRespuesta.getEstadoSolicitud() == SolicitudAdopcion.EstadoSolicitud.ACEPTADA) {
                    Mascota mascota = solicitudAdopcion.getMascotaSolicitada();
                    Usuario adoptante = solicitudAdopcion.getUsuarioAdoptante();

                    if (mascota != null) {
                        // Cambiar el estado de la mascota a ADOPTADA primero
                        mascota.setStatusPublicacion(Mascota.StatusPublicacion.ADOPTADA);
                        mascotaRepository.save(mascota);
                        
                        // Crear registro de adopción
                        Adopcion adopcion = new Adopcion();
                        adopcion.setAdoptante(adoptante);
                        adopcion.setMascota(mascota);
                        adopcion.setSolicitud(solicitudAdopcion);
                        adopcion.setFechaAdopcion(solicitudAdopcion.getFechaResolucion());
                        adopcionRepository.save(adopcion);
                    }
                }

                // Persistencia
                return solicitudRepository.save(solicitudAdopcion); 
        });
    }

    //Mostrar Solicitud
    public Optional<SolicitudAdopcion> mostrarSolicitud(Long idSolicitud){
        return solicitudRepository.findByIdSolicitud(idSolicitud);
    }

}




