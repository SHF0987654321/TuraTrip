package com.TuraTrip.backend.services;

import java.util.List;

import com.TuraTrip.backend.dtos.request.ComentarioRequest;
import com.TuraTrip.backend.dtos.response.ComentarioResponse;

public interface ComentarioService {

    ComentarioResponse crearComentario(
            Long publicacionId,
            String correoUsuario,
            ComentarioRequest request
    );

    List<ComentarioResponse> obtenerComentarios(Long publicacionId);

}
