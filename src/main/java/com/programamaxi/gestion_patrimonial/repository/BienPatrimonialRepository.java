package com.programamaxi.gestion_patrimonial.repository;

import com.programamaxi.gestion_patrimonial.entity.BienPatrimonial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BienPatrimonialRepository extends JpaRepository<BienPatrimonial, String> {

    // Método para buscar bienes por estado (ej: BUENO, EN REPARACION)
    List<BienPatrimonial> findByEstado(String estado);

    // Búsqueda por coincidencia en la descripción
    List<BienPatrimonial> findByDescripcionContainingIgnoreCase(String descripcion);
}
