package com.programamaxi.gestion_patrimonial.entity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "localidades")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Localidad {

    @Id
    @Column(name = "codigo_postal", length = 10)
    private String codigoPostal;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;
}
