package com.programamaxi.gestion_patrimonial.repository;

import com.programamaxi.gestion_patrimonial.entity.Personal;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PersonalRepository extends JpaRepository<Personal, String> {

    @Query("SELECT DISTINCT p.codigoPrograma FROM Personal p WHERE p.codigoPrograma IS NOT NULL AND p.codigoPrograma != '' ORDER BY p.codigoPrograma")
    List<String> findDistinctCodigoPrograma();

    @Query("SELECT DISTINCT p.categoria FROM Personal p WHERE p.categoria IS NOT NULL ORDER BY p.categoria")
    List<Integer> findDistinctCategoria();
}
