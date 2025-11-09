package com.example.umascota.model.transaccion;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

import com.example.umascota.model.usuario.Usuario;

@Entity
@Table(name = "donacion")
public class Donacion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_donacion")
    private Long idDonacion;

    @ManyToOne
    @JoinColumn(name = "id_usuario_donante", nullable = false)
    private Usuario usuarioDonante;

    @Column(name = "monto", nullable = false)
    private BigDecimal monto;

    @Column(name = "moneda", length = 10)
    private String moneda;

    @Column(name = "pasarela_pago")
    private String pasarelaPago;

    @Column(name = "referencia_pago")
    private String referenciaPago;

    @Column(name = "recibo_url")
    private String reciboUrl;

    @Column(name = "fecha")
    private Timestamp fecha;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado")
    private EstadoDonacion estado;

    @Column(name = "mensaje_donante")
    private String mensajeDonante;

    // Relación 1:N con Transaccion
    @OneToMany(mappedBy = "donacion", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Transaccion> transacciones;

    public enum EstadoDonacion{
        PENDIENTE,
        COMPLETA,
        FALLIDA,
        REEMBOLSADA;
    }

    // Getters y Setters
    public Long getIdDonacion() {
        return idDonacion;
    }

    public void setIdDonacion(Long idDonacion) {
        this.idDonacion = idDonacion;
    }

    public Usuario getUsuarioDonante() {
        return usuarioDonante;
    }

    public void setUsuarioDonante(Usuario usuarioDonante) {
        this.usuarioDonante = usuarioDonante;
    }

    public BigDecimal getMonto() {
        return monto;
    }

    public void setMonto(BigDecimal monto) {
        this.monto = monto;
    }

    public String getMoneda() {
        return moneda;
    }

    public void setMoneda(String moneda) {
        this.moneda = moneda;
    }

    public String getPasarelaPago() {
        return pasarelaPago;
    }

    public void setPasarelaPago(String pasarelaPago) {
        this.pasarelaPago = pasarelaPago;
    }

    public String getReferenciaPago() {
        return referenciaPago;
    }

    public void setReferenciaPago(String referenciaPago) {
        this.referenciaPago = referenciaPago;
    }

    public String getReciboUrl() {
        return reciboUrl;
    }

    public void setReciboUrl(String reciboUrl) {
        this.reciboUrl = reciboUrl;
    }

    public Timestamp getFecha() {
        return fecha;
    }

    public void setFecha(Timestamp fecha) {
        this.fecha = fecha;
    }

    public EstadoDonacion getEstado() {
        return estado;
    }

    public void setEstado(EstadoDonacion estado) {
        this.estado = estado;
    }

    public String getMensajeDonante() {
        return mensajeDonante;
    }

    public void setMensajeDonante(String mensajeDonante) {
        this.mensajeDonante = mensajeDonante;
    }

    public List<Transaccion> getTransacciones() {
        return transacciones;
    }

    public void setTransacciones(List<Transaccion> transacciones) {
        this.transacciones = transacciones;
    }
}
