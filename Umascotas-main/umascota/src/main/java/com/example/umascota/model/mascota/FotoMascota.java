package com.example.umascota.model.mascota;



import jakarta.persistence.*;

@Entity
@Table(name = "FotoMascota")
public class FotoMascota {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_foto")
    private Long idFoto;

    private String url;
    private String descripcion;

    @Column(name = "fecha_subidaa")
    private java.sql.Timestamp fechaSubida;

    @ManyToOne
    @JoinColumn(name = "id_mascota" , referencedColumnName = "id_mascota",  nullable = false)
    private Mascota mascota;
    
    private boolean principal;

    public Long getIdFoto(){
        return idFoto;
    }
    public void setIdFoto(Long idFoto){
        this.idFoto = idFoto;
    }

    public String getUrl(){
        return url;
    }
    public void setUrl(String url){
        this.url = url;
    }

    public String getDescripcion(){
        return descripcion;
    }
    public void setDescripcion(String descripcion){
        this.descripcion = descripcion;
    }

    public boolean getPrincipal(){
        return principal;
    }

    public void setPrincipal(boolean principal){
        this.principal = principal;
    }

    public java.sql.Timestamp getFechaSubida() {
        return fechaSubida;
    }

    public void setFechaSubida(java.sql.Timestamp fechaSubida) {
        this.fechaSubida = fechaSubida;
    }

    public Mascota getMascota(){
        return mascota;
    }

    public void setMascota(Mascota mascota){
        this.mascota = mascota;
    }

}
