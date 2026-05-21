package com.tiendaropa.controller;

import com.tiendaropa.dto.CategoriaDTO;
import com.tiendaropa.entity.Categoria;
import com.tiendaropa.entity.Producto;
import com.tiendaropa.service.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/categorias")
@CrossOrigin(origins = "http://localhost:4200")
public class CategoriaController {

    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Categoria>> listarTodas() {
        return ResponseEntity.ok(service.listarTodas());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtenerPorId(@PathVariable Long id) {
        return service.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> crear(@Valid @RequestBody CategoriaDTO dto) {
        try {
            return ResponseEntity.status(HttpStatus.CREATED).body(service.crear(dto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(@PathVariable Long id, @Valid @RequestBody CategoriaDTO dto) {
        try {
            return ResponseEntity.ok(service.actualizar(id, dto));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        service.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/productos")
    public ResponseEntity<List<Producto>> obtenerProductos(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(service.listarProductosPorCategoria(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
