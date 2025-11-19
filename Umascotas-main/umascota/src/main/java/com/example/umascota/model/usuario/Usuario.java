package com.example.umascota.model.usuario;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;


@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_usuario")
    private Long idUsuario;

    @Column(name = "nombre_completo", nullable = false)
    private String nombreCompleto;

    @Column(name = "correo_electronico", nullable = false, unique = true)
    private String correoElectronico;

    @Column(nullable = true)
    private String contrasena;

    @Column(name = "telefono")
    private String telefono;

    @Column(name = "ciudad")
    private String ciudad;

    @Column(name = "direccion")
    private String direccion;

    @Column(name = "documento_identidad")
    private String documentoIdentidad;

    @Column(name = "email_verified")
    private boolean emailVerified;
    
    @Column(name = "notifications_enabled")
    private boolean notificationsEnabled;
    
    @Column(name = "google_id")
    private String googleId;

    @CreationTimestamp
    @Column(name = "fecha_registro", updatable = false)
    private java.sql.Timestamp fechaRegistro;

    @Enumerated(EnumType.STRING)
    @Column(name = "rol", nullable = false)
    private Rol rol;

    public enum Rol {
        ADMIN,
        USUARIO
    }

    public Usuario() {
    }

    // Getters y Setters
    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getCorreoElectronico() {
        return correoElectronico;
    }

    public void setCorreoElectronico(String correoElectronico) {
        this.correoElectronico = correoElectronico;
    }

    public String getContrasena() {
        return contrasena;
    }

    public void setContrasena(String contrasena) {
        this.contrasena = contrasena;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCiudad() {
        return ciudad;
    }

    public void setCiudad(String ciudad) {
        this.ciudad = ciudad;
    }

    public String getDireccion(){
        return direccion;
    }

    public void setDireccion(String direccion){
        this.direccion = direccion;
    }

    public String getDocumento(){
        return documentoIdentidad;
    }
    public void setDocumento(String documentoIdentidad){
        this.documentoIdentidad = documentoIdentidad;
    }

    public boolean getEmailVerified(){
        return emailVerified;
    }

    public void setEmailVerified(boolean email_verified){
        this.emailVerified = email_verified;
    }

    public boolean getNotificationsEnabled(){
        return notificationsEnabled;
    }

    public void setNotificationsEnabled(boolean notificationsEnabled){
        this.notificationsEnabled = notificationsEnabled;
    }

    public String getGoogleId() {
        return googleId;
    }

    public void setGoogleId(String googleId) {
        this.googleId = googleId;
    }

    public java.sql.Timestamp getFechaRegistro() {
        return fechaRegistro;
    }

    public void setFechaRegistro(java.sql.Timestamp fechaRegistro) {
        this.fechaRegistro = fechaRegistro;
    }

    public Rol getTipoUsuario() {
        return rol;
    }

    public void setTipoUsuario(Rol tipoUsuario) {
        this.rol = tipoUsuario;
    }
}