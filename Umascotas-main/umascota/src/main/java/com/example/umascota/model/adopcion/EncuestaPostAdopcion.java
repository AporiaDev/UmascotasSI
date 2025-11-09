package com.example.umascota.model.adopcion;

import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "encuesta_post_adopcion")
public class EncuestaPostAdopcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_encuesta")
    private Long idEncuesta;

    @ManyToOne
    @JoinColumn(name = "id_solicitud", nullable = false)
    private SolicitudAdopcion solicitud;

    @OneToOne
    @JoinColumn(name = "id_adopcion", nullable = false)
    private Adopcion adopcion;

    @Column(name = "fecha_envio")
    private Timestamp fechaEnvio;

    @Column(name = "respuestas", columnDefinition = "JSON")
    private String respuestas;

    @Column(name = "alerta_critica")
    private boolean alertaCritica;

    // Getters y Setters
    public Long getIdEncuesta() {
        return idEncuesta;
    }

    public void setIdEncuesta(Long idEncuesta) {
        this.idEncuesta = idEncuesta;
    }

    public SolicitudAdopcion getSolicitud() {
        return solicitud;
    }

    public void setSolicitud(SolicitudAdopcion solicitud) {
        this.solicitud = solicitud;
    }

    public Adopcion getAdopcion() {
        return adopcion;
    }

    public void setAdopcion(Adopcion adopcion) {
        this.adopcion = adopcion;
    }

    public Timestamp getFechaEnvio() {
        return fechaEnvio;
    }

    public void setFechaEnvio(Timestamp fechaEnvio) {
        this.fechaEnvio = fechaEnvio;
    }

    public String getRespuestas() {
        return respuestas;
    }

    public void setRespuestas(String respuestas) {
        this.respuestas = respuestas;
    }

    public boolean isAlertaCritica() {
        return alertaCritica;
    }

    public void setAlertaCritica(boolean alertaCritica) {
        this.alertaCritica = alertaCritica;
    }
}
