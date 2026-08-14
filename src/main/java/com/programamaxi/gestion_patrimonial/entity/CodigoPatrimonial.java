package com.programamaxi.gestion_patrimonial.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "codigos_patrimoniales")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CodigoPatrimonial {

    @Id
    @Column(name = "codigo", length = 20)
    private String codigo;

    @Column(name = "grupo", nullable = false, length = 100)
    private String grupo;
}