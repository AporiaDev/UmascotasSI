package com.example.umascota.model.adopcion;


import com.example.umascota.model.mascota.Mascota;
import com.example.umascota.model.usuario.Usuario;
import jakarta.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "solicitudes_adopcion")
public class SolicitudAdopcion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitud")
    private Long idSolicitud;

    @ManyToOne
    @JoinColumn(name = "id_mascota_solicitada", referencedColumnName = "id_mascota", nullable = false)
    private Mascota mascotaSolicitada;

    @ManyToOne
    @JoinColumn(name = "id_usuario_adoptante", referencedColumnName = "id_usuario", nullable = false)
    private Usuario usuarioAdoptante;

    @Column(name = "fecha_solicitud", nullable = false)
    private Timestamp fechaSolicitud;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_solicitud", nullable = false)
    private EstadoSolicitud estadoSolicitud;

    @Column(name = "mensaje_adoptante", columnDefinition = "TEXT")
    private String mensajeAdoptante;

    @Column(name = "fecha_resolucion")
    private Timestamp fechaResolucion;

    @ManyToOne
    @JoinColumn(name = "id_usuario_resolvio", referencedColumnName = "id_usuario", nullable = true)
    private Usuario usuarioResolvio;

    public enum EstadoSolicitud {
        PENDIENTE,
        ACEPTADA,
        RECHAZADA,
        CANCELADA
    }


    // Getters y setters
    public Long getIdSolicitud() { return idSolicitud; }
    public void setIdSolicitud(Long idSolicitud) { this.idSolicitud = idSolicitud; }

    public Mascota getMascotaSolicitada() { return mascotaSolicitada; }
    public void setMascotaSolicitada(Mascota mascotaSolicitada) { this.mascotaSolicitada = mascotaSolicitada; }

    public Usuario getUsuarioAdoptante() { return usuarioAdoptante; }
    public void setUsuarioAdoptante(Usuario usuario) { this.usuarioAdoptante = usuario; }

    public Usuario getUsuarioResolvio() { return usuarioResolvio; }
    public void setUsuarioResolvio(Usuario usuarioResolvio) { this.usuarioResolvio = usuarioResolvio; }

    public Timestamp getFechaSolicitud() { return fechaSolicitud; }
    public void setFechaSolicitud(Timestamp fechaSolicitud) { this.fechaSolicitud = fechaSolicitud; }

    public EstadoSolicitud getEstadoSolicitud() { return estadoSolicitud; }
    public void setEstadoSolicitud(EstadoSolicitud estadoSolicitud) { this.estadoSolicitud = estadoSolicitud; }

    public String getMensajeAdoptante() { return mensajeAdoptante; }
    public void setMensajeAdoptante(String mensajeAdoptante) { this.mensajeAdoptante = mensajeAdoptante; }

    public Timestamp getFechaResolucion() { return fechaResolucion; }
    public void setFechaResolucion(Timestamp fechaResolucion) { this.fechaResolucion = fechaResolucion; }
}
