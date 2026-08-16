package com.programamaxi.gestion_patrimonial.controller;

import com.programamaxi.gestion_patrimonial.entity.Programas;
import com.programamaxi.gestion_patrimonial.repository.PersonalRepository;
import com.programamaxi.gestion_patrimonial.repository.ProgramaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/opciones")
@CrossOrigin(origins = "*")
public class OpcionesController {

    @Autowired
    private PersonalRepository personalRepository;

    @Autowired
    private ProgramaRepository programaRepository;

    @GetMapping("/programas")
    public List<String> getProgramas() {
        return programaRepository.findAll()
                .stream()
                .map(Programas::getCodigoPrograma)
                .toList();
    }

    @GetMapping("/categorias")
    public List<Integer> getCategorias() {
        return personalRepository.findDistinctCategoria();
    }
}