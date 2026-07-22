package com.TuraTrip.backend.services;

import com.TuraTrip.backend.dtos.request.EditarPerfilRequest;
import com.TuraTrip.backend.dtos.response.PerfilResponse;

public interface PerfilService {

    PerfilResponse obtenerPerfil(String correo);

    PerfilResponse editarPerfil(
        String correo,
        EditarPerfilRequest request
    );
}
