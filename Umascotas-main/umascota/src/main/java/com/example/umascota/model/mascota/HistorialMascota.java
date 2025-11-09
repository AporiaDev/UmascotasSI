package com.example.umascota.model.mascota;



import jakarta.persistence.*;

@Entity
@Table(name = "HistorialMascota")
public class HistorialMascota {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento")
    private Long idEvento;

    private java.sql.Timestamp fecha;

    private String descripcion;

    @Column(name = "tipo_evento")
    @Enumerated(EnumType.STRING)
    private TipoEventoMascota tipoEvento;

    @ManyToOne
    @JoinColumn(name = "id_mascota", referencedColumnName = "id_mascota",nullable = false)
    private Mascota mascota;

    public enum TipoEventoMascota{

        VACUNACION,
        TRATAMIENTO,
        CAMBIO_ESTADO,
        ADOPCION,
        DEVOLUCION,
        OTRO;

    }

    public Long getIdEvento(){
        return idEvento;
    }
    public void setIdEvento(Long idEvento){
        this.idEvento = idEvento;
    }

    public java.sql.Timestamp getFecha(){
        return fecha;
    }
    public void setFecha(java.sql.Timestamp fecha){
        this.fecha = fecha;
    }

    public String getDescripcion(){
        return descripcion;
    }
    public void setDescripcion(String descripcion){
        this.descripcion = descripcion;
    }

    public TipoEventoMascota getTipoEventoMascota(){
        return tipoEvento;
    }

    public void setTipoEventoMascota(TipoEventoMascota tipoEvento){
        this.tipoEvento = tipoEvento;
    }

    public Mascota getMascota(){
        return mascota;
    }

    public void setMascota(Mascota mascota){
        this.mascota = mascota;
    }
    

}
