package com.programamaxi.gestion_patrimonial.entity;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bienes_patrimoniales")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BienPatrimonial {

    @Id
    @Column(name = "numero_inventario", length = 50)
    private String numeroInventario;

    @Column(name = "descripcion", nullable = false, columnDefinition = "TEXT")
    private String descripcion;

    @Column(name = "marca", length = 100)
    private String marca;

    @Column(name = "cantidad", precision = 10, scale = 2)
    private BigDecimal cantidad;

    @Column(name = "fecha_ingreso")
    private LocalDateTime fechaIngreso;

    @Column(name = "importe_total", precision = 12, scale = 2)
    private BigDecimal importeTotal;

    @Column(name = "estado", nullable = false, length = 30)
    private String estado;

    @Column(name = "codigo_patrimonial", length = 20)
    private String codigoPatrimonial;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "codigo_postal_localidad")
    private Localidad localidad;

    @Column(name = "cuil_depositario", length = 13)
    private String cuilDepositario;

    @Column(name = "cuil_responsable", length = 13)
    private String cuilResponsable;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;
}
