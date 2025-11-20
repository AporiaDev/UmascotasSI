package com.example.umascota.model.adopcion;

import jakarta.persistence.*;
import java.sql.Timestamp;

import com.example.umascota.model.mascota.Mascota;
import com.example.umascota.model.usuario.Usuario;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "adopcion")
public class Adopcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_adopcion")
    private Long idAdopcion;

    @ManyToOne
    @JoinColumn(name = "id_mascota", nullable = false)
    @JsonIgnoreProperties({"usuarioPublica"})
    private Mascota mascota;

    @ManyToOne
    @JoinColumn(name = "id_adoptante", nullable = false)
    private Usuario adoptante;

    @ManyToOne
    @JoinColumn(name = "id_solicitud", nullable = false)
    @JsonIgnoreProperties({"mascotaSolicitada", "usuarioAdoptante"})
    private SolicitudAdopcion solicitud;

    @Column(name = "fecha_adopcion")
    private Timestamp fechaAdopcion;

    @Column(name = "notas")
    private String notas;

    // Relación 1:N con EncuestaPostAdopcion (una adopción puede tener múltiples encuestas)
    @OneToMany(mappedBy = "adopcion", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private java.util.List<EncuestaPostAdopcion> encuestasPostAdopcion;

    // Getters y Setters
    public Long getIdAdopcion() {
        return idAdopcion;
    }

    public void setIdAdopcion(Long idAdopcion) {
        this.idAdopcion = idAdopcion;
    }

    public Mascota getMascota() {
        return mascota;
    }

    public void setMascota(Mascota mascota) {
        this.mascota = mascota;
    }

    public Usuario getAdoptante() {
        return adoptante;
    }

    public void setAdoptante(Usuario adoptante) {
        this.adoptante = adoptante;
    }

    public SolicitudAdopcion getSolicitud() {
        return solicitud;
    }

    public void setSolicitud(SolicitudAdopcion solicitud) {
        this.solicitud = solicitud;
    }

    public Timestamp getFechaAdopcion() {
        return fechaAdopcion;
    }

    public void setFechaAdopcion(Timestamp fechaAdopcion) {
        this.fechaAdopcion = fechaAdopcion;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }

    public java.util.List<EncuestaPostAdopcion> getEncuestasPostAdopcion() {
        return encuestasPostAdopcion;
    }

    public void setEncuestasPostAdopcion(java.util.List<EncuestaPostAdopcion> encuestasPostAdopcion) {
        this.encuestasPostAdopcion = encuestasPostAdopcion;
    }
}
