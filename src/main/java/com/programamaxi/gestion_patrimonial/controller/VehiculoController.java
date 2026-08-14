package com.programamaxi.gestion_patrimonial.controller;

import com.programamaxi.gestion_patrimonial.entity.Vehiculo;
import com.programamaxi.gestion_patrimonial.repository.VehiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehiculos")
@CrossOrigin(origins = "*")
public class VehiculoController {

    @Autowired
    private VehiculoRepository vehiculoRepository;

    @GetMapping
    public List<Vehiculo> listarTodos() {
        return vehiculoRepository.findAll();
    }

    @PostMapping
    public Vehiculo guardar(@RequestBody Vehiculo vehiculo) {
        return vehiculoRepository.save(vehiculo);
    }

    @DeleteMapping("/{dominio}")
    public ResponseEntity<Void> eliminar(@PathVariable String dominio) {
        if (vehiculoRepository.existsById(dominio)) {
            vehiculoRepository.deleteById(dominio);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
