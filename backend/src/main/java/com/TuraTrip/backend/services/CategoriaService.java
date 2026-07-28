package com.TuraTrip.backend.services;

import java.util.List;

import com.TuraTrip.backend.dtos.request.CategoriaRequest;
import com.TuraTrip.backend.dtos.response.CategoriaResponse;

public interface CategoriaService {
    List<CategoriaResponse> obtenerTodasLasCategorias();
    CategoriaResponse crearCategoria(CategoriaRequest request);
    CategoriaResponse actualizarCategoria(Long id, CategoriaRequest request);
    void eliminarCategoria(Long id);
}
