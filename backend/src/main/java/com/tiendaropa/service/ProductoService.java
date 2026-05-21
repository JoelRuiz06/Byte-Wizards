package com.tiendaropa.service;

import com.tiendaropa.dto.ProductoDTO;
import com.tiendaropa.entity.Categoria;
import com.tiendaropa.entity.Producto;
import com.tiendaropa.repository.CategoriaRepository;
import com.tiendaropa.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {

    private final ProductoRepository prodRepo;
    private final CategoriaRepository catRepo;

    public ProductoService(ProductoRepository prodRepo, CategoriaRepository catRepo) {
        this.prodRepo = prodRepo;
        this.catRepo = catRepo;
    }

    public List<Producto> listarTodos() {
        return prodRepo.findAll();
    }

    public Optional<Producto> buscarPorId(Long id) {
        return prodRepo.findById(id);
    }

    public Producto crear(ProductoDTO dto) {
        Categoria cat = catRepo.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        Producto p = new Producto();
        p.setNombre(dto.getNombre());
        p.setDescripcion(dto.getDescripcion());
        p.setPrecio(dto.getPrecio());
        p.setTalla(dto.getTalla());
        p.setStock(dto.getStock());
        p.setImagenUrl(dto.getImagenUrl());
        p.setCategoria(cat);
        return prodRepo.save(p);
    }

    public Producto actualizar(Long id, ProductoDTO dto) {
        Producto p = prodRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
        Categoria cat = catRepo.findById(dto.getCategoriaId())
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        p.setNombre(dto.getNombre());
        p.setDescripcion(dto.getDescripcion());
        p.setPrecio(dto.getPrecio());
        p.setTalla(dto.getTalla());
        p.setStock(dto.getStock());
        p.setImagenUrl(dto.getImagenUrl());
        p.setCategoria(cat);
        return prodRepo.save(p);
    }

    public void eliminar(Long id) {
        prodRepo.deleteById(id);
    }
}
