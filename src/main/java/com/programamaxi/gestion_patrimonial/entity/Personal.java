package com.programamaxi.gestion_patrimonial.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "personal")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Personal {

    @Id
    @Column(name = "cuil", length = 13)
    private String cuil;

    @Column(name = "nombre_apellido", nullable = false, length = 150)
    private String nombreApellido;

    @Column(name = "codigo_programa", length = 50)
    private String codigoPrograma;

    @Column(name = "categoria", precision = 5, scale = 2)
    private BigDecimal categoria;
}