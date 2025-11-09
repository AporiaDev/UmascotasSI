package com.example.umascota.model.mascota;

import java.util.List;

import jakarta.persistence.*;

@Entity
@Table(name = "mascotas")
public class Mascota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mascota")
    private Long idMascota;

    private String nombre;

    private String especie;

    private String raza;

    private Integer edad;

    @Enumerated(EnumType.STRING)
    @Column(name = "tamano")
    private Tamano tamano;

    private String descripcion;

    @Column(name = "estado_salud")
    private String estadoSalud;

    private boolean esterilizado;

    @Enumerated(EnumType.STRING)
    private Sexo sexo;

    @Column(name = "foto_url")
    private String foto;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_publicacion", nullable = false)
    private StatusPublicacion statusPublicacion;

    @ManyToOne
    @JoinColumn(name = "id_usuario_publica", referencedColumnName = "id_usuario", nullable = false)
    private Long idUsuarioPublica;

    @OneToMany(mappedBy = "mascota", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vacuna> vacunas;

    @OneToMany(mappedBy = "mascota", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<FotoMascota> fotos;

    @Column(name = "created_at", updatable = false, insertable = false)
    private java.sql.Timestamp createdAt;


    // ENUM para estado_publicacion
    public enum StatusPublicacion {
        DISPONIBLE,
        RESERVADO,
        ADOPTADO,
        NO_DISPONIBLE;
    }

    public enum Tamano{

        GRANDE,
        MEDIANO,
        PEQUENO,
        OTRO;
    }

    public enum Sexo{

        MACHO,
        HEMBRA,
        OTRO;

    }

    public java.sql.Timestamp getCreatedAt(){
        return createdAt;
    }
    public void setCreatedAt(java.sql.Timestamp createdAt){
        this.createdAt = createdAt;
    }

    // Getters y Setters
    public Long getIdMascota() {
        return idMascota;
    }

    public void setIdMascota(Long idMascota) {
        this.idMascota = idMascota;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getEspecie() {
        return especie;
    }

    public void setEspecie(String especie) {
        this.especie = especie;
    }

    public String getRaza() {
        return raza;
    }

    public void setRaza(String raza) {
        this.raza = raza;
    }

    public Integer getEdad() {
        return edad;
    }

    public void setEdad(Integer edad) {
        this.edad = edad;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getEstadoSalud() {
        return estadoSalud;
    }

    public void setEstadoSalud(String estadoSalud) {
        this.estadoSalud = estadoSalud;
    }

    public String getFoto() {
        return foto;
    }

    public void setFoto(String foto) {
        this.foto = foto;
    }

    public StatusPublicacion getStatusPublicacion() {
        return statusPublicacion;
    }

    public void setStatusPublicacion(StatusPublicacion statusPublicacion) {
        this.statusPublicacion = statusPublicacion;
    }

    public Long getIdUsuarioPublica() {
        return idUsuarioPublica;
    }

    public void setIdUsuarioPublica(Long idUsuarioPublica) {
        this.idUsuarioPublica = idUsuarioPublica;
    }

    public boolean getEsteralizado(){
        return esterilizado;
    }
    public void setEsteralizado(boolean esterilizado){
        this.esterilizado = esterilizado;
    }

    public Sexo getSexo(){
        return sexo;
    }
    public void setSexo(Sexo sexo){
        this.sexo = sexo;
    }

    public Tamano getTamano(){
        return tamano;
    }
    public void setTamano(Tamano tamano){
        this.tamano = tamano;
    }
}