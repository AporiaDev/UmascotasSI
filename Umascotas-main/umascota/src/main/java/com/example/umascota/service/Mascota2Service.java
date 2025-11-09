package com.example.umascota.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.umascota.model.mascota.Mascota;
import com.example.umascota.repository.MascotaRepository;

@Service
public class Mascota2Service {

    @Autowired
    private MascotaRepository mascotaRepository;

    //Crear Mascota
    public Mascota crearMascota(Mascota mascota){

        if (mascotaRepository.existsByNombreIgnoreCase(mascota.getNombre())) {
            throw new IllegalArgumentException("La mascota ya está registrada");
        }else{
            return mascotaRepository.save(mascota);  
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
    public Optional<Mascota> obtenerPorId(Long id){
        return mascotaRepository.findByIdMascota(id);
    }

    //Obtener todas las mascotas
    public List<Mascota> obtenerTodas(){
        return mascotaRepository.findAll();
    }
}
