package com.programamaxi.gestion_patrimonial.repository;

import com.programamaxi.gestion_patrimonial.entity.Personal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonalRepository extends JpaRepository<Personal, String> {
}
