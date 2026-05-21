package com.tiendaropa.service;

import com.tiendaropa.dto.CategoriaDTO;
import com.tiendaropa.entity.Categoria;
import com.tiendaropa.entity.Producto;
import com.tiendaropa.repository.CategoriaRepository;
import com.tiendaropa.repository.ProductoRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CategoriaService {

    private final CategoriaRepository catRepo;
    private final ProductoRepository prodRepo;

    public CategoriaService(CategoriaRepository catRepo, ProductoRepository prodRepo) {
        this.catRepo = catRepo;
        this.prodRepo = prodRepo;
    }

    public List<Categoria> listarTodas() {
        return catRepo.findAll();
    }

    public Optional<Categoria> buscarPorId(Long id) {
        return catRepo.findById(id);
    }

    public Categoria crear(CategoriaDTO dto) {
        if (catRepo.existsByNombreIgnoreCase(dto.getNombre())) {
            throw new IllegalArgumentException("Ya existe una categoría con ese nombre");
        }
        return catRepo.save(new Categoria(dto.getNombre(), dto.getDescripcion()));
    }

    public Categoria actualizar(Long id, CategoriaDTO dto) {
        Categoria c = catRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada"));
        c.setNombre(dto.getNombre());
        c.setDescripcion(dto.getDescripcion());
        return catRepo.save(c);
    }

    public void eliminar(Long id) {
        catRepo.deleteById(id);
    }

    public List<Producto> listarProductosPorCategoria(Long id) {
        if (!catRepo.existsById(id)) {
            throw new RuntimeException("Categoría no encontrada");
        }
        return prodRepo.findByCategoriaId(id);
    }
}
