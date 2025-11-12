package com.example.umascota.model.transaccion;
import jakarta.persistence.*;
import java.math.BigDecimal;
import java.sql.Timestamp;

@Entity
@Table(name = "transaccion")
public class Transaccion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_transaccion")
    private Long idTransaccion;

    @ManyToOne
    @JoinColumn(name = "id_donacion", nullable = false)
    private Donacion donacion;

    @Column(name = "monto", nullable = false)
    private BigDecimal monto;

    @Column(name = "moneda", length = 10)
    private String moneda;

    @Column(name = "codigo_autorizacion")
    private String codigoAutorizacion;

    @Column(name = "metodo_pago")
    private String metodoPago;

    @Column(name = "estado_pasarela")
    private String estadoPasarela;

    @Column(name = "referencia_externa")
    private String referenciaExterna;

    @Column(name = "fecha")
    private Timestamp fecha;

    @Column(name = "detalle", columnDefinition = "JSON")
    private String detalle;

    // Getters y Setters
    public Long getIdTransaccion() {
        return idTransaccion;
    }

    public void setIdTransaccion(Long idTransaccion) {
        this.idTransaccion = idTransaccion;
    }

    public Donacion getDonacion() {
        return donacion;
    }

    public void setDonacion(Donacion donacion) {
        this.donacion = donacion;
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

    public String getCodigoAutorizacion() {
        return codigoAutorizacion;
    }

    public void setCodigoAutorizacion(String codigoAutorizacion) {
        this.codigoAutorizacion = codigoAutorizacion;
    }

    public String getMetodoPago() {
        return metodoPago;
    }

    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }

    public String getEstadoPasarela() {
        return estadoPasarela;
    }

    public void setEstadoPasarela(String estadoPasarela) {
        this.estadoPasarela = estadoPasarela;
    }

    public String getReferenciaExterna() {
        return referenciaExterna;
    }

    public void setReferenciaExterna(String referenciaExterna) {
        this.referenciaExterna = referenciaExterna;
    }

    public Timestamp getFecha() {
        return fecha;
    }

    public void setFecha(Timestamp fecha) {
        this.fecha = fecha;
    }

    public String getDetalle() {
        return detalle;
    }

    public void setDetalle(String detalle) {
        this.detalle = detalle;
    }
}
