package com.programamaxi.gestion_patrimonial.controller;

import com.programamaxi.gestion_patrimonial.entity.Personal;
import com.programamaxi.gestion_patrimonial.repository.PersonalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/personal")
@CrossOrigin(origins = "*")
public class PersonalController {

    @Autowired
    private PersonalRepository personalRepository;

    @GetMapping
    public List<Personal> listarTodos() {
        return personalRepository.findAll();
    }

    @PostMapping
    public Personal guardar(@RequestBody Personal personal) {
        return personalRepository.save(personal);
    }

    @PutMapping("/{cuil}")
    public ResponseEntity<Personal> actualizar(@PathVariable String cuil, @RequestBody Personal datos) {
        return personalRepository.findById(cuil)
                .map(p -> {
                    p.setNombreApellido(datos.getNombreApellido());
                    p.setCodigoPrograma(datos.getCodigoPrograma());
                    p.setCategoria(datos.getCategoria());
                    return ResponseEntity.ok(personalRepository.save(p));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{cuil}")
    public ResponseEntity<Void> eliminar(@PathVariable String cuil) {
        if (personalRepository.existsById(cuil)) {
            personalRepository.deleteById(cuil);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

}
