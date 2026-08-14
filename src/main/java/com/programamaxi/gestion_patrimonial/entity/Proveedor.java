package com.programamaxi.gestion_patrimonial.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "proveedores")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Proveedor {

    @Id
    @Column(name = "cuit", length = 13)
    private String cuit;

    @Column(name = "razon_social", nullable = false, length = 200)
    private String razonSocial;
}
