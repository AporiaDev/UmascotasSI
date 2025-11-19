package com.example.umascota.model.mascota;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

@Entity
@Table(name = "mascotas")
public class Mascota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_mascota")
    private Long idMascota;

    @Column(nullable = false)
    private String nombre;

    @Column(nullable = false)
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

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_usuario_publica", referencedColumnName = "id_usuario", nullable = true)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "contrasena", "fechaRegistro", "googleId"})
    private com.example.umascota.model.usuario.Usuario usuarioPublica;
    
    // Campo auxiliar para facilitar el acceso al ID
    @Transient
    private Long idUsuarioPublica;

    @OneToMany(mappedBy = "mascota", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Vacuna> vacunas;

    @OneToMany(mappedBy = "mascota", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<FotoMascota> fotos;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false, nullable = false)
    private java.sql.Timestamp createdAt;


    // ENUM para estado_publicacion
    public enum StatusPublicacion {
        DISPONIBLE,
        RESERVADA,
        ADOPTADA,
        NO_DISPONIBLE
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

    @com.fasterxml.jackson.annotation.JsonGetter("idUsuarioPublica")
    public Long getIdUsuarioPublica() {
        try {
            if (usuarioPublica != null) {
                // Intentar acceder al ID, esto inicializará el proxy si es necesario
                return usuarioPublica.getIdUsuario();
            }
        } catch (Exception e) {
            // Si hay un error de lazy loading, usar el campo transiente
            System.err.println("Error al obtener idUsuarioPublica: " + e.getMessage());
        }
        return idUsuarioPublica;
    }

    public void setIdUsuarioPublica(Long idUsuarioPublica) {
        this.idUsuarioPublica = idUsuarioPublica;
    }
    
    public com.example.umascota.model.usuario.Usuario getUsuarioPublica() {
        return usuarioPublica;
    }
    
    public void setUsuarioPublica(com.example.umascota.model.usuario.Usuario usuarioPublica) {
        this.usuarioPublica = usuarioPublica;
        if (usuarioPublica != null) {
            this.idUsuarioPublica = usuarioPublica.getIdUsuario();
        }
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