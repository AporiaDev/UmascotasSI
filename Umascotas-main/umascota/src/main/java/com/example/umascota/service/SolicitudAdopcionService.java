package com.example.umascota.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.example.umascota.model.adopcion.SolicitudAdopcion;
import com.example.umascota.repository.MascotaRepository;
import com.example.umascota.repository.SolicitudAdopcionRepository;
import com.example.umascota.repository.UsuarioRepository;
import com.example.umascota.model.usuario.Usuario;
import com.example.umascota.model.mascota.Mascota;

public class SolicitudAdopcionService {
    
    @Autowired
    private SolicitudAdopcionRepository solicitudRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private MascotaRepository mascotaRepository;

    //Listar Solicitudes
    public List<SolicitudAdopcion> mostrarSolicitudes(){
        return solicitudRepository.findAll();
    }

    //BuscarSolicitud por id // Pasar a Optional
    public List<SolicitudAdopcion> buscarSolicitud(Long IdSolicitud){
        return solicitudRepository.findByIdSolicitud(IdSolicitud);
    }

    //Crear Solicitud de adopcion

    public SolicitudAdopcion crearSolicitud(Long IdUsuario, Long idMascota, SolicitudAdopcion datosSolicitud){

        Usuario usuario = usuarioRepository.findByIdUsuario(IdUsuario);
        Mascota mascota = mascotaRepository.findByIdMascota(IdMascota);

        datosSolicitud.setUsuarioAdoptante(usuario);
        datosSolicitud.setIdMascota(mascota);

        return solicitudRepository.save(datosSolicitud);


    }

    




}
