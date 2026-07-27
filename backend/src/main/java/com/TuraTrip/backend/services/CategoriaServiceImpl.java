package com.TuraTrip.backend.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.TuraTrip.backend.dtos.request.CategoriaRequest;
import com.TuraTrip.backend.dtos.response.CategoriaResponse;
import com.TuraTrip.backend.exceptions.CategoriaEnUsoException;
import com.TuraTrip.backend.exceptions.CategoriaYaExistenteException;
import com.TuraTrip.backend.exceptions.ResourceNotFoundException;
import com.TuraTrip.backend.models.Categoria;
import com.TuraTrip.backend.repositories.CategoriaRepository;
import com.TuraTrip.backend.repositories.PublicacionRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoriaServiceImpl implements CategoriaService {

    private final CategoriaRepository categoriaRepository;
    private final PublicacionRepository publicacionRepository;

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaResponse> obtenerTodasLasCategorias() {
        return categoriaRepository.findAll().stream()
                .map(categoria -> new CategoriaResponse(categoria.getId(), categoria.getNombre()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CategoriaResponse crearCategoria(CategoriaRequest request) {
        categoriaRepository.findByNombreIgnoreCase(request.nombre())
            .ifPresent(c -> {
                throw new CategoriaYaExistenteException("Ya existe una categoría con ese nombre");
            });

        Categoria categoria = Categoria.builder()
                .nombre(request.nombre().trim())
                .build();

        Categoria guardada = categoriaRepository.save(categoria);
        return new CategoriaResponse(guardada.getId(), guardada.getNombre());
    }

    @Override
    @Transactional
    public CategoriaResponse actualizarCategoria(Long id, CategoriaRequest request) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        categoriaRepository.findByNombreIgnoreCase(request.nombre().trim())
                .filter(c -> !c.getId().equals(id))
                .ifPresent(c -> {
                    throw new CategoriaYaExistenteException("Ya existe una categoría con ese nombre");
                });

        categoria.setNombre(request.nombre().trim());
        Categoria actualizada = categoriaRepository.save(categoria);
        return new CategoriaResponse(actualizada.getId(), actualizada.getNombre());
    }

    @Override
    @Transactional
    public void eliminarCategoria(Long id) {
        Categoria categoria = categoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        int publicacionesConCategoria = publicacionRepository.countByCategoriaId(id);
        if (publicacionesConCategoria > 0) {
            throw new CategoriaEnUsoException("La categoría está en uso y no se puede eliminar");
        }

        categoriaRepository.delete(categoria);
    }
}
