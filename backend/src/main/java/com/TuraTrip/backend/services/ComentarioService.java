package com.TuraTrip.backend.services;

import java.util.List;

import org.springframework.data.domain.Page;

import com.TuraTrip.backend.dtos.request.ComentarioRequest;
import com.TuraTrip.backend.dtos.response.ComentarioResponse;

public interface ComentarioService {

    ComentarioResponse crearComentario(
            Long publicacionId,
            String correoUsuario,
            ComentarioRequest request
    );

    List<ComentarioResponse> obtenerComentarios(Long publicacionId);

    ComentarioResponse editarComentario(
            Long publicacionId,
            Long comentarioId,
            String correoUsuario,
            ComentarioRequest request
    );

    void eliminarComentario(
            Long publicacionId,
            Long comentarioId,
            String correoUsuario
    );

    Page<ComentarioResponse> obtenerComentariosPorUsuarioId(Long usuarioId, int page, int size);

}
