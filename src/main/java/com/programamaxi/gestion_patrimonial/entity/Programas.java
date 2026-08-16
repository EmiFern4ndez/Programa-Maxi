package com.programamaxi.gestion_patrimonial.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "programas")
public class Programas {

    @Id
    @Column(name = "codigo_programa")
    private String codigoPrograma;

    private String nombre;
}