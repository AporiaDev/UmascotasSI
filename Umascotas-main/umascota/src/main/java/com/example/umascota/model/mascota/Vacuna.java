package com.example.umascota.model.mascota;



import jakarta.persistence.*;

@Entity
@Table(name = "Vacuna")

public class Vacuna {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_vacuna")
    private Long idVacuna;

    private String nombre;

    @Column(name = "fecha_aplicacion")
    private java.sql.Timestamp fechaAplicacion;

    private String notas;

    @ManyToOne
    @JoinColumn(name = "id_mascota", nullable = false)
    private Mascota mascota;

    public Long getIdVacuna(){
        return idVacuna;
    }
    public void setIdVacuna(Long idVacuna){
        this.idVacuna = idVacuna;
    }

    public String getNombreVacuna(){
        return nombre;
    }
    public void setNombreVacuna(String nombre){
        this.nombre = nombre;
    }

    public String getNotas(){
        return notas;
    }
    public void setNotas(String notas){
        this.notas = notas;
    }

    public Mascota getMascota(){
        return mascota;
    }

    public void setMascota(Mascota mascota){
        this.mascota = mascota;
    }

    public java.sql.Timestamp getFecha(){
        return fechaAplicacion;
    }
    public void setFecha(java.sql.Timestamp fechaAplicacion){
        this.fechaAplicacion = fechaAplicacion;
    }

}
