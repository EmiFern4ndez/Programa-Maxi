package com.programamaxi.gestion_patrimonial.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "vehiculos")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Vehiculo {

    @Id
    @Column(name = "dominio", length = 20)
    private String dominio;

    @Column(name = "marca", length = 100)
    private String marca;

    @Column(name = "modelo_anio")
    private Integer modeloAnio;
}
