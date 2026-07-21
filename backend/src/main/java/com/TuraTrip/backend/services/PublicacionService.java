package com.TuraTrip.backend.services;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.TuraTrip.backend.dtos.request.PublicacionRequest;
import com.TuraTrip.backend.dtos.response.PublicacionResponse;

public interface PublicacionService {
    
    PublicacionResponse crearPublicacion(String correo, PublicacionRequest request, MultipartFile archivo);

    List<PublicacionResponse> obtenerPublicacionesPorUsuario(String correo);

    List<PublicacionResponse> obtenerTodasLasPublicaciones();

    PublicacionResponse obtenerPublicacionPorId(Long id);
}
