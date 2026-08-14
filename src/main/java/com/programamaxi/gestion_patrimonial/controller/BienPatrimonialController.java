package com.programamaxi.gestion_patrimonial.controller;

import com.programamaxi.gestion_patrimonial.entity.BienPatrimonial;
import com.programamaxi.gestion_patrimonial.repository.BienPatrimonialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bienes")
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE})
public class BienPatrimonialController {

    @Autowired
    private BienPatrimonialRepository bienRepository;

    // GET /api/bienes - Obtener todos los bienes
    @GetMapping
    public List<BienPatrimonial> obtenerTodos() {
        return bienRepository.findAll();
    }

    // GET /api/bienes/{inventario} - Buscar bien por número de inventario
    @GetMapping("/{inventario}")
    public ResponseEntity<BienPatrimonial> obtenerPorInventario(@PathVariable String inventario) {
        return bienRepository.findById(inventario)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/bienes - Registrar un nuevo bien
    @PostMapping
    public BienPatrimonial crearBien(@RequestBody BienPatrimonial bien) {
        return bienRepository.save(bien);
    }

    // PUT /api/bienes/{inventario} - Modificar un bien existente
    @PutMapping("/{inventario}")
    public ResponseEntity<BienPatrimonial> actualizarBien(
            @PathVariable String inventario,
            @RequestBody BienPatrimonial bienActualizado) {

        return bienRepository.findById(inventario)
                .map(bien -> {
                    bien.setDescripcion(bienActualizado.getDescripcion());
                    bien.setMarca(bienActualizado.getMarca());
                    bien.setCantidad(bienActualizado.getCantidad());
                    bien.setEstado(bienActualizado.getEstado());
                    bien.setImporteTotal(bienActualizado.getImporteTotal());
                    bien.setLocalidad(bienActualizado.getLocalidad());
                    bien.setCuilDepositario(bienActualizado.getCuilDepositario());
                    bien.setCuilResponsable(bienActualizado.getCuilResponsable());
                    return ResponseEntity.ok(bienRepository.save(bien));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // DELETE /api/bienes/{inventario} - Eliminar un bien
    @DeleteMapping("/{inventario}")
    public ResponseEntity<Void> eliminarBien(@PathVariable String inventario) {
        if (bienRepository.existsById(inventario)) {
            bienRepository.deleteById(inventario);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/bienes")
    public Page<BienPatrimonial> getBienes(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return bienRepository.findAll(pageable);
    }
}
