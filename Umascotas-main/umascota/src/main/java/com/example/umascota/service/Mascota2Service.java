package com.example.umascota.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.umascota.model.mascota.Mascota;
import com.example.umascota.model.usuario.Usuario;
import com.example.umascota.repository.MascotaRepository;
import com.example.umascota.repository.UsuarioRepository;

@Service
@Transactional
public class Mascota2Service {

    @Autowired
    private MascotaRepository mascotaRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private NotificacionService notificacionService;

    //Crear Mascota
    public Mascota crearMascota(Mascota mascota){

        if (mascotaRepository.existsByNombreIgnoreCase(mascota.getNombre())) {
            throw new IllegalArgumentException("La mascota ya está registrada");
        }else{
            // Si se proporciona idUsuarioPublica, buscar y establecer la relación
            Long idUsuarioCreador = null;
            if (mascota.getIdUsuarioPublica() != null) {
                Optional<Usuario> usuarioOpt = usuarioRepository.findByIdUsuario(mascota.getIdUsuarioPublica());
                if (usuarioOpt.isPresent()) {
                    mascota.setUsuarioPublica(usuarioOpt.get());
                    idUsuarioCreador = mascota.getIdUsuarioPublica();
                } else {
                    throw new IllegalArgumentException("Usuario no encontrado con ID: " + mascota.getIdUsuarioPublica());
                }
            }
            
            Mascota mascotaGuardada = mascotaRepository.save(mascota);
            
            // Crear notificaciones para todos los usuarios cuando se crea una nueva mascota
            if (mascotaGuardada.getStatusPublicacion() == Mascota.StatusPublicacion.DISPONIBLE) {
                try {
                    notificacionService.notificarNuevaMascota(
                        mascotaGuardada.getIdMascota(),
                        mascotaGuardada.getNombre(),
                        idUsuarioCreador != null ? idUsuarioCreador : 0L
                    );
                } catch (Exception e) {
                    // Log el error pero no fallar la creación de la mascota
                    System.err.println("Error al crear notificaciones: " + e.getMessage());
                }
            }
            
            return mascotaGuardada;  
        }

    }
    //Borrar Mascota
    public void borrarMascota(Long id){

        if (mascotaRepository.existsByIdMascota(id)) {
            mascotaRepository.deleteByIdMascota(id);
            
        }else{
            throw new IllegalArgumentException("La mascota no está registrada");
        }
        
    }
    //Actualizar Datos Mascota
    public Optional<Mascota> actualizarDatosMascota(Long id, Mascota nuevosDatosMascota){

        return mascotaRepository.findByIdMascota(id).map(mascota -> {
            mascota.setNombre(nuevosDatosMascota.getNombre());
            mascota.setEspecie(nuevosDatosMascota.getEspecie());
            mascota.setRaza(nuevosDatosMascota.getRaza());
            mascota.setEdad(nuevosDatosMascota.getEdad());
            mascota.setSexo(nuevosDatosMascota.getSexo());
            mascota.setTamano(nuevosDatosMascota.getTamano());
            mascota.setDescripcion(nuevosDatosMascota.getDescripcion());
            mascota.setEstadoSalud(nuevosDatosMascota.getEstadoSalud());
            mascota.setFoto(nuevosDatosMascota.getFoto());
            mascota.setStatusPublicacion(nuevosDatosMascota.getStatusPublicacion());
            mascota.setIdUsuarioPublica(nuevosDatosMascota.getIdUsuarioPublica());
            return mascotaRepository.save(mascota);            
        });
    }

    //Listar Mascotas
    @Transactional(readOnly = true)
    public Optional<Mascota> obtenerPorId(Long id){
        Optional<Mascota> mascotaOpt = mascotaRepository.findByIdMascota(id);
        if (mascotaOpt.isPresent()) {
            Mascota mascota = mascotaOpt.get();
            try {
                if (mascota.getUsuarioPublica() != null) {
                    // Forzar la inicialización
                    mascota.getUsuarioPublica().getIdUsuario();
                    mascota.getUsuarioPublica().getNombreCompleto();
                }
            } catch (Exception e) {
                System.err.println("Error al inicializar usuarioPublica: " + e.getMessage());
            }
        }
        return mascotaOpt;
    }

    //Obtener todas las mascotas
    @Transactional(readOnly = true)
    public List<Mascota> obtenerTodas(){
        try {
            List<Mascota> mascotas = mascotaRepository.findAll();
            System.out.println("Total de mascotas encontradas: " + mascotas.size());
            
            // Asegurar que las relaciones estén inicializadas antes de serializar
            for (Mascota mascota : mascotas) {
                try {
                    if (mascota.getUsuarioPublica() != null) {
                        // Forzar la inicialización accediendo a varios campos
                        mascota.getUsuarioPublica().getIdUsuario();
                        mascota.getUsuarioPublica().getNombreCompleto();
                        mascota.getUsuarioPublica().getCorreoElectronico();
                    }
                } catch (Exception e) {
                    System.err.println("Error al inicializar usuarioPublica para mascota " + mascota.getIdMascota() + ": " + e.getMessage());
                    e.printStackTrace();
                }
            }
            return mascotas;
        } catch (Exception e) {
            System.err.println("Error crítico al obtener todas las mascotas: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }
}
